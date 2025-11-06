        """
        Enhanced ShopMart Agent with navigation and product selection capabilities

        ARCHITECTURE:
        - FastAPI Backend (Product API): http://localhost:8040
        - MCP Server: http://localhost:8050
        - Frontend (React/Vue): http://localhost:5173

        IMPORTANT URL MAPPINGS:
        - Frontend uses /services (NOT /products) for product catalog
        - Frontend uses /services/{id} (NOT /service/{id} or /product/{id}) for product details
        - Backend MUST send RELATIVE PATHS (e.g., "/services", NOT "http://localhost:5173/services")
        - React Router's navigate() function expects relative paths, not full URLs
        """

        import logging
        import json
        import httpx
        from typing import Optional, Dict, Any, List, Tuple
        from difflib import SequenceMatcher
        from livekit.agents import Agent, AgentSession, RunContext
        from livekit.agents.llm import function_tool, FunctionTool
        from livekit.plugins import openai
        from voice_agent.utils.load_prompt import load_prompt
        from voice_agent.utils.load_info import load_info
        from dataclasses import dataclass

        logger = logging.getLogger("enhanced-shopmart-agent")

        @dataclass
        class NaamaUserData:
            """User data for Naama agent sessions"""
            session: AgentSession = None
            room: Any = None  # Store room reference
            current_page: str = "home"
            current_service_id: Optional[int] = None
            search_filters: Dict[str, List[str]] = None
            first_run: bool = True
            
            def __post_init__(self):
                if self.search_filters is None:
                    self.search_filters = {
                        "categories": [],
                        "sectors": [],
                        "entities": [],
                        "service_types": []
                    }

        class EnhancedNammaAgent(Agent):
            """
            Enhanced voice agent for Naama digital services with navigation capabilities
            """
            
            # API configuration - FastAPI backend
            API_BASE_URL = "http://localhost:8040"
            
            # Product name to ID mapping cache
            _product_mapping_cache: Optional[Dict[str, int]] = None
            
            def __init__(self, mcp_servers: Optional[List] = None) -> None:
                instructions = load_prompt("voice_agent_prompt.txt").format(
                    namma_info=load_info("namma_info.txt")
                )

                # Enhance instructions with navigation capabilities for ShopMart
                enhanced_instructions = f"""
                {instructions}

                ## Navigation and Product Discovery for ShopMart

                You have the ability to:
                1. Navigate between pages (home, products catalog, cart, product details, checkout)
                2. Search and filter products using **semantic search** (understands meaning, not just keywords)
                3. Open specific products when requested
                4. Help users find the right products based on their shopping needs
                5. Manage shopping cart (add/remove items, view cart)

                ### Semantic Search Capability:
                - You have access to intelligent semantic search powered by vector embeddings
                - The search understands Arabic meaning and context, not just exact keyword matches
                - You can search using natural language descriptions of what the user wants
                - Examples:
                * User: "أبحث عن جوال آيفون" → Finds iPhone smartphones
                * User: "أحتاج جهاز لابتوب للألعاب" → Finds gaming laptops
                * User: "ملابس رياضية للنساء" → Finds women's sportswear
                * User: "عطر فاخر" → Finds premium perfumes
                * User: "أجهزة مطبخ كهربائية" → Finds electric kitchen appliances
                - The search automatically returns the most relevant products based on semantic similarity

                ### Navigation Commands:
                - "Go to home/services/cart/checkout/profile" - Navigate to specific pages
                - "Show me products" - Navigate to products catalog (frontend route: /services)
                - "Find products about [topic]" - Search for specific products using semantic search
                - "Filter by [category/brand/price]" - Apply filters to product search
                - "Open product [name/number]" - Open a specific product detail page (frontend route: /services/{id})
                - "Add to cart" - Add current product to shopping cart
                - "Show my cart" - View shopping cart (frontend route: /cart)
                - "Go to checkout" - Proceed to checkout page (frontend route: /checkout)
                - "Go to profile" or "Go to dashboard" - View user profile (frontend route: /profile)
                - "Sign in" - Navigate to sign in page (frontend route: /auth/signin)
                - "Sign up" - Navigate to sign up page (frontend route: /auth/signup)

                ### Product Search & Opening BY NAME (with Fuzzy Matching):
                - When user says "افتح منتج iPhone" or "اذهب لمنتج iPhone", use agent_open_product with product name
                - **FLEXIBLE MATCHING**: The system uses intelligent fuzzy matching to recognize:
                * Exact product names: "آيفون 15 برو ماكس"
                * Partial names: "iPhone", "iPhone Pro", "آيفون"
                * Slight variations/typos: "ايفون", "iphone", "IPHONE"
                * Brand names only: "Samsung", "Nike", "Sony"
                * Abbreviated names: "PS5", "XPS", "EOS"
                - Auto-opens immediately if match confidence is high (≥75% similarity)
                - Asks for confirmation if match confidence is moderate (60-75% similarity)
                - Shows multiple options if confidence is low or multiple similar products exist
                - Examples:
                * User: "افتح آيفون" → Auto-opens iPhone 15 Pro Max (high confidence)
                * User: "اذهب لمنتج iPhone Pro" → Auto-opens iPhone 15 Pro Max (partial match)
                * User: "ورّيني السامسونج" → Auto-opens Samsung Galaxy (brand match)
                * User: "افتح PS5" → Auto-opens PlayStation 5 (abbreviation)
                * User: "منتج رقم 5" → Opens product ID 5 directly

                ### Smart Filtering BY CATEGORY/AUDIENCE:
                - When user asks to see products for specific categories or audiences, use agent_show_products_by_filter
                - This function navigates to /services and shows filtered products
                - Examples:
                * User: "ورّيني المنتجات اللي للأفراد" → Use: agent_show_products_by_filter("للأفراد", audience="أفراد")
                * User: "عندكم إلكترونيات؟" → Use: agent_show_products_by_filter("في الإلكترونيات", category="الإلكترونيات")
                * User: "أبغى أشوف منتجات قطاع الأعمال" → Use: agent_show_products_by_filter("لقطاع الأعمال", audience="قطاع أعمال")
                * User: "ورّيني الأزياء عندكم" → Use: agent_show_products_by_filter("من الأزياء", category="الأزياء والموضة")

                ### Available Filter Options for ShopMart:
                - **Categories**: الإلكترونيات, الأزياء والموضة, المنزل والمطبخ, الرياضة واللياقة, الجمال والعناية, الكتب والألعاب
                - **Audiences**: أفراد, قطاع أعمال, الجمعيات التطوعية, جهات حكومية, زوار المملكة
                - **Brands**: Apple, Samsung, Nike, Adidas, Sony, LG, Huawei, etc.
                - **Features**: شحن مجاني, عروض وخصومات, منتجات جديدة, الأكثر مبيعاً

                ### Product Interaction:
                - When showing filtered products, always include product IDs so user can open them
                - Provide clear information about product features, price, availability, and shipping
                - After showing products, ask which one they want to open

                ### Shopping Experience:
                - Always mention product prices in Saudi Riyals (ريال)
                - Inform about free shipping for orders over 200 SAR
                - Mention 14-day return policy when relevant
                - Highlight special offers and discounts
                - Suggest related or complementary products when appropriate

                Always:
                - Be enthusiastic and helpful like a personal shopping assistant
                - Confirm navigation actions with the user
                - Provide context about where you're navigating
                - Help users understand what they can do on each page
                - Be proactive in suggesting relevant products based on user needs
                - Use the semantic search to find products even when users describe their needs vaguely
                - Make the shopping experience smooth and enjoyable
                """

                super().__init__(
                    instructions=enhanced_instructions,
                    mcp_servers=mcp_servers
                )

                # Fast LLM for quick acknowledgments
                self.fast_llm = openai.LLM(model="gpt-4o-mini")
            
            async def on_enter(self):
                """Called when agent enters the session"""
                if hasattr(self, 'session') and self.session.userdata and self.session.userdata.first_run:
                    self.session.say("أهلاً وسهلاً! أنا شوب بوت، مساعدك الشخصي للتسوق في شوب مارت. كيف أقدر أساعدك اليوم؟")
                    self.session.userdata.first_run = False
            
            async def _fetch_services_from_api(
                self, 
                query: Optional[str] = None,
                category: Optional[str] = None,
                k: int = 3
            ) -> List[Dict[str, Any]]:
                """
                Fetch services from the API with optional filters.
                Uses vector search for semantic search when query is provided.
                
                Args:
                    query: Search query (uses vector search for semantic matching)
                    category: Category filter
                    k: Number of results for vector search (default: 10)
                    
                Returns:
                    List of services matching the criteria
                """
                try:
                    async with httpx.AsyncClient() as client:
                        # If query is provided, use vector search endpoint
                        if query:
                            logger.info(f"Using vector search for query: '{query}' (k={k})")
                            response = await client.get(
                                f"{self.API_BASE_URL}/api/services/search",
                                params={'query': query, 'k': k},
                                timeout=10.0
                            )
                            
                            if response.status_code == 200:
                                data = response.json()
                                services = data.get('services', [])
                                search_type = data.get('search_type', 'unknown')
                                
                                logger.info(f"Vector search returned {len(services)} services (type: {search_type})")
                                
                                # Apply additional filters if provided
                                if category:
                                    services = [s for s in services if s.get('category') == category]
                                # subCategory and serviceAudiences removed in new schema
                                
                                logger.info(f"After filters: {len(services)} services")
                                return services
                            else:
                                logger.error(f"Vector search API returned status code: {response.status_code}")
                                # Fall through to regular API call
                        
                        # No query or vector search failed - use regular list endpoint
                        params = {}
                        if category:
                            params['category'] = category
                        # sub_category and audience removed in new schema
                        
                        logger.info(f"Fetching services from list API with params: {params}")
                        response = await client.get(
                            f"{self.API_BASE_URL}/api/services/",
                            params=params,
                            timeout=5.0
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            services = data.get('services', [])
                            logger.info(f"Found {len(services)} services")
                            return services
                        else:
                            logger.error(f"API returned status code: {response.status_code}")
                            return []
                            
                except Exception as e:
                    logger.error(f"Error fetching services from API: {e}")
                    return []
            
            async def _send_rpc_to_frontend(self, context: RunContext[NaamaUserData], method: str, data: Dict[str, Any]) -> str:
                """Send RPC call to frontend"""
                try:
                    logger.info(f"Attempting to send RPC '{method}' with data: {data}")
                    
                    if not context or not context.userdata:
                        logger.error("Context or userdata not available")
                        return "Error: Context not available"
                    
                    # Get room from userdata
                    room = context.userdata.room
                    if not room:
                        logger.error("Room not available in userdata")
                        return "Error: Room not available"
                        
                    logger.info(f"Room found: {room}, participants: {len(room.remote_participants)}")
                    
                    remote_participants = list(room.remote_participants.values())
                    if not remote_participants:
                        logger.error("No remote participants found")
                        return "Error: No frontend client connected"
                        
                    client = remote_participants[0]
                    logger.info(f"Sending RPC to client: {client.identity}")
                    
                    result = await room.local_participant.perform_rpc(
                        destination_identity=client.identity,
                        method=method,
                        payload=json.dumps(data)
                    )
                    
                    logger.info(f"Successfully sent RPC '{method}' to frontend. Response: {result}")
                    return f"Successfully sent {method} command to frontend"
                    
                except Exception as e:
                    logger.error(f"Failed to send RPC '{method}': {e}")
                    return f"Error sending command to frontend: {str(e)}"
            
            @function_tool
            async def agent_navigate_to_page(
                self,
                context: RunContext[NaamaUserData],
                page: str,
                product_id: Optional[int] = None
            ) -> str:
                """
                Navigate to a specific page in the ShopMart application.

                Args:
                    page: Page to navigate to (home, services, cart, checkout, profile, signin, signup, product_detail)
                    product_id: Optional product ID for product detail pages
                """
                valid_pages = ["home", "services", "cart", "checkout", "profile", "signin", "signup", "product_detail"]

                if page not in valid_pages:
                    return f"الصفحة '{page}' غير موجودة. الصفحات المتاحة هي: {', '.join(valid_pages)}"

                # Build navigation URL based on page - MUST match frontend routes exactly
                # Frontend expects RELATIVE PATHS: /services, /cart, /checkout, /profile, /auth/signin, /auth/signup
                # DO NOT include http://localhost:5173 - React Router's navigate() expects relative paths!
                if page == "home":
                    url = "/"
                elif page == "services":
                    # Frontend route is /services (not /products)
                    url = "/services"
                elif page == "cart":
                    # Cart has its own dedicated page
                    url = "/cart"
                elif page == "checkout":
                    url = "/checkout"
                elif page == "profile":
                    url = "/profile"
                elif page == "signin":
                    url = "/auth/signin"
                elif page == "signup":
                    url = "/auth/signup"
                elif page == "product_detail" and product_id:
                    # Frontend route is /services/{id} (not /service/{id} or /product/{id})
                    url = f"/services/{product_id}"
                else:
                    return "يجب تحديد رقم المنتج للانتقال إلى صفحة تفاصيل المنتج"

                # Send navigation RPC with relative path (React Router will handle it)
                result = await self._send_rpc_to_frontend(context, "client.navigate", {"url": url})

                if "Successfully" in result:
                    context.userdata.current_page = page
                    context.userdata.current_service_id = product_id if page == "product_detail" else None

                    # Provide voice feedback
                    page_names = {
                        "home": "الصفحة الرئيسية",
                        "services": "كتالوج المنتجات",
                        "cart": "سلة التسوق",
                        "checkout": "إتمام الطلب",
                        "profile": "الملف الشخصي",
                        "signin": "تسجيل الدخول",
                        "signup": "إنشاء حساب",
                        "product_detail": f"تفاصيل المنتج رقم {product_id}"
                    }

                    return f"تم الانتقال إلى {page_names.get(page, page)}"

                return result
            
            @function_tool
            async def agent_search_products(
                self,
                context: RunContext[NaamaUserData],
                query: str,
                category: Optional[str] = None,
                brand: Optional[str] = None,
                k: int = 5,
                auto_open_if_one: bool = False
            ) -> str:
                """
                Search for products using semantic search based on query and filters.
                Uses vector embeddings to understand meaning, not just keywords.

                Args:
                    query: Search query in Arabic or English (can be natural language description)
                    category: Optional category filter (e.g., "الإلكترونيات", "الأزياء والموضة")
                    brand: Optional brand filter (e.g., "Apple", "Samsung", "Nike")
                    k: Number of results to return (default 5)
                    auto_open_if_one: If True and only one result found, automatically open it
                """
                # Fetch products from API using semantic vector search (FastAPI on port 8040)
                logger.info(f"Agent searching for products: query='{query}', k={k}")
                services = await self._fetch_services_from_api(
                    query=query,
                    category=category,
                    k=k
                )

                if services:
                    # If only one result and auto_open is enabled, open it directly
                    if len(services) == 1 and auto_open_if_one:
                        product_id = services[0]['serviceId']
                        return await self.agent_open_product(context, str(product_id))

                    response = f"لقيت منتجات رائعة لـ '{query}':\n\n"
                    for i, service in enumerate(services[:5], 1):  # Show top 5 results
                        cost = service.get('price', 'غير محدد')
                        category_name = service.get('category', 'غير محدد')
                        response += f"{i}. {service['name']}\n"
                        response += f"   السعر: {cost} ريال | الفئة: {category_name}\n"
                        response += f"   الرقم: {service['serviceId']}\n\n"

                    if len(services) > 5:
                        response += f"\n... وفيه منتجات أخرى مشابهة كثير\n"

                    response += "\nأي منتج تبي أفتحه لك؟ قول الرقم أو الاسم وأنا أساعدك."
                    return response
                else:
                    return f"ما لقيت منتجات تطابق '{query}'. جرب تبحث بكلمات ثانية أو قول لي بالضبط وش تحتاج."
            
            @function_tool
            async def agent_apply_filters(
                self,
                context: RunContext[NaamaUserData],
                filter_type: str,
                filter_value: str,
                action: str = "add"
            ) -> str:
                """
                Apply or remove filters on product search.

                Args:
                    filter_type: Type of filter (category, brand, price_range, feature)
                    filter_value: Value to filter by
                    action: Whether to add or remove the filter
                """
                valid_filter_types = ["category", "brand", "price_range", "feature"]

                if filter_type not in valid_filter_types:
                    return f"نوع الفلتر '{filter_type}' غير صالح. الأنواع المتاحة: {', '.join(valid_filter_types)}"

                # Navigate to services if not there
                if context.userdata.current_page != "services":
                    await self.agent_navigate_to_page(context, "services")

                # Update local filters
                filter_key = f"{filter_type}s"

                if action == "add":
                    if filter_value not in context.userdata.search_filters[filter_key]:
                        context.userdata.search_filters[filter_key].append(filter_value)
                else:
                    if filter_value in context.userdata.search_filters[filter_key]:
                        context.userdata.search_filters[filter_key].remove(filter_value)

                # Send filter update to frontend
                filter_data = {
                    "action": "filter",
                    "filters": context.userdata.search_filters
                }

                await self._send_rpc_to_frontend(context, "client.filter", filter_data)

                action_text = "تمت إضافة" if action == "add" else "تمت إزالة"
                filter_names = {
                    "category": "الفئة",
                    "brand": "الماركة",
                    "price_range": "نطاق السعر",
                    "feature": "الميزة"
                }
                return f"{action_text} فلتر {filter_names.get(filter_type, filter_type)}: {filter_value}"
            
            async def _get_service_by_id(self, service_id: str) -> Optional[Dict[str, Any]]:
                """
                Fetch a specific service by ID from the API.
                
                Args:
                    service_id: Service ID
                    
                Returns:
                    Service details or None if not found
                """
                try:
                    async with httpx.AsyncClient() as client:
                        logger.info(f"Fetching service {service_id} from API")
                        response = await client.get(
                            f"{self.API_BASE_URL}/api/services/{service_id}",
                            timeout=5.0
                        )
                        
                        if response.status_code == 200:
                            service = response.json()
                            logger.info(f"Found service: {service.get('name')}")
                            return service
                        else:
                            logger.error(f"Service {service_id} not found: {response.status_code}")
                            return None
                            
                except Exception as e:
                    logger.error(f"Error fetching service {service_id}: {e}")
                    return None
            
            def _calculate_similarity(self, str1: str, str2: str) -> float:
                """
                Calculate similarity ratio between two strings using SequenceMatcher.
                Returns a value between 0.0 (no match) and 1.0 (perfect match).
                
                Args:
                    str1: First string
                    str2: Second string
                    
                Returns:
                    Similarity ratio (0.0 to 1.0)
                """
                str1_lower = str1.lower().strip()
                str2_lower = str2.lower().strip()
                
                # Exact match
                if str1_lower == str2_lower:
                    return 1.0
                
                # Check if one string contains the other (partial match)
                if str1_lower in str2_lower or str2_lower in str1_lower:
                    # Bonus for substring match
                    return 0.85 + (0.15 * SequenceMatcher(None, str1_lower, str2_lower).ratio())
                
                # Use SequenceMatcher for fuzzy matching
                return SequenceMatcher(None, str1_lower, str2_lower).ratio()
            
            async def _find_best_product_match(
                self,
                search_term: str,
                threshold: float = 0.5
            ) -> Optional[Tuple[int, float, str]]:
                """
                Find the best matching product using fuzzy and partial matching.
                
                Args:
                    search_term: The product name or partial name to search for
                    threshold: Minimum similarity score to consider (0.0 to 1.0, default 0.5)
                    
                Returns:
                    Tuple of (product_id, similarity_score, product_title) or None if no match above threshold
                """
                # Fetch all products
                services = await self._fetch_services_from_api()
                
                if not services:
                    return None
                
                best_match = None
                best_score = threshold
                best_title = ""
                
                search_term_cleaned = search_term.lower().strip()
                
                for service in services:
                    product_id = service.get('serviceId') or service.get('id')
                    title = service.get('name', '')
                    
                    if not product_id or not title:
                        continue
                    
                    # Calculate similarity with full title
                    similarity = self._calculate_similarity(search_term_cleaned, title)
                    
                    # Also check similarity with individual words in title
                    words = title.replace('،', ' ').replace('-', ' ').split()
                    for word in words:
                        if len(word.strip()) >= 3:
                            word_similarity = self._calculate_similarity(search_term_cleaned, word)
                            similarity = max(similarity, word_similarity)
                    
                    # Update best match if this is better
                    if similarity > best_score:
                        best_score = similarity
                        best_match = product_id
                        best_title = title
                
                if best_match:
                    logger.info(f"Best match for '{search_term}': {best_title} (ID: {best_match}, score: {best_score:.2f})")
                    return (best_match, best_score, best_title)
                
                return None
            
            async def _build_product_name_mapping(self) -> Dict[str, int]:
                """
                Build a mapping of product names/keywords to their IDs.
                This allows quick lookup when user mentions a product name.
                
                Returns:
                    Dictionary mapping product name variations to product IDs
                """
                if EnhancedNammaAgent._product_mapping_cache is not None:
                    return EnhancedNammaAgent._product_mapping_cache
                
                logger.info("Building product name-to-ID mapping...")
                mapping = {}
                
                # Fetch all products
                services = await self._fetch_services_from_api()
                
                for service in services:
                    product_id = service.get('serviceId') or service.get('id')
                    title = service.get('name', '')
                    
                    if not product_id or not title:
                        continue
                    
                    # Add full title (both original case and lowercase)
                    mapping[title.lower()] = product_id
                    
                    # Extract keywords from title and create variations
                    # Remove common words and split by spaces
                    words = title.replace('،', ' ').replace('-', ' ').split()
                    
                    # Add individual significant words (3+ characters)
                    for word in words:
                        cleaned_word = word.strip().lower()
                        if len(cleaned_word) >= 3:
                            mapping[cleaned_word] = product_id
                    
                    # Add common product name patterns
                    # For electronics with model numbers
                    if 'آيفون' in title or 'ايفون' in title or 'iPhone' in title.lower():
                        mapping['آيفون'] = product_id
                        mapping['ايفون'] = product_id
                        mapping['iphone'] = product_id
                    
                    if 'سامسونج' in title or 'Samsung' in title.lower():
                        mapping['سامسونج'] = product_id
                        mapping['samsung'] = product_id
                    
                    if 'لابتوب' in title or 'laptop' in title.lower():
                        mapping['لابتوب'] = product_id
                        mapping['laptop'] = product_id
                    
                    if 'ديل' in title or 'Dell' in title.lower():
                        mapping['ديل'] = product_id
                        mapping['dell'] = product_id
                    
                    if 'سماعات' in title or 'سماعة' in title:
                        mapping['سماعات'] = product_id
                        mapping['سماعة'] = product_id
                    
                    if 'سوني' in title or 'Sony' in title.lower():
                        mapping['سوني'] = product_id
                        mapping['sony'] = product_id
                    
                    if 'ساعة' in title and ('أبل' in title or 'Apple' in title.lower()):
                        mapping['ساعة أبل'] = product_id
                        mapping['apple watch'] = product_id
                        mapping['ساعة'] = product_id
                    
                    if 'كاميرا' in title:
                        mapping['كاميرا'] = product_id
                    
                    if 'كانون' in title or 'Canon' in title.lower():
                        mapping['كانون'] = product_id
                        mapping['canon'] = product_id
                    
                    if 'نايكي' in title or 'Nike' in title.lower():
                        mapping['نايكي'] = product_id
                        mapping['nike'] = product_id
                    
                    if 'أديداس' in title or 'اديداس' in title or 'Adidas' in title.lower():
                        mapping['أديداس'] = product_id
                        mapping['اديداس'] = product_id
                        mapping['adidas'] = product_id
                    
                    if 'بلايستيشن' in title or 'بلاي ستيشن' in title or 'PlayStation' in title.lower():
                        mapping['بلايستيشن'] = product_id
                        mapping['بلاي ستيشن'] = product_id
                        mapping['playstation'] = product_id
                        mapping['ps5'] = product_id
                    
                    if 'ديسون' in title or 'Dyson' in title.lower():
                        mapping['ديسون'] = product_id
                        mapping['dyson'] = product_id
                
                # Cache the mapping
                EnhancedNammaAgent._product_mapping_cache = mapping
                logger.info(f"Built product mapping with {len(mapping)} entries")
                
                return mapping
            
            @function_tool
            async def agent_open_product(
                self,
                context: RunContext[NaamaUserData],
                product_identifier: str
            ) -> str:
                """
                Open a specific product by ID or name. Uses smart fuzzy matching for flexible recognition.
                Supports partial names, slight variations, and mispronunciations.

                Args:
                    product_identifier: Product ID (number) or product name (e.g., "iPhone", "iPhone Pro", "آيفون")
                """
                # Try to parse as ID first
                try:
                    product_id = int(product_identifier)
                    logger.info(f"Opening product by ID: {product_id}")

                    # Get product details from API (FastAPI on port 8040)
                    service = await self._get_service_by_id(str(product_id))

                    if service:
                        # Navigate to product detail page (frontend route: /services/{id})
                        await self.agent_navigate_to_page(context, "product_detail", product_id)
                        cost = service.get('price', 'غير محدد')
                        category = service.get('category', 'غير محدد')
                        return f"حاضر! فتحت لك: {service['name']}\nالسعر: {cost} ريال\nالفئة: {category}\n\nتبي تضيفه للسلة؟"
                    else:
                        return f"عذراً، ما لقيت منتج برقم {product_id}. جرب رقم ثاني أو قول لي اسم المنتج."

                except ValueError:
                    # Not a number, treat as product name
                    logger.info(f"Searching for product by name: '{product_identifier}'")
                    
                    # STEP 1: Check the name-to-ID mapping first (exact matches - fastest)
                    product_mapping = await self._build_product_name_mapping()
                    
                    # Try exact match (case insensitive)
                    search_term = product_identifier.strip().lower()
                    
                    if search_term in product_mapping:
                        product_id = product_mapping[search_term]
                        logger.info(f"Found exact match in mapping: '{search_term}' -> ID {product_id}")
                        return await self.agent_open_product(context, str(product_id))
                    
                    # Try partial matches in mapping keys (substring matching)
                    for key, mapped_id in product_mapping.items():
                        if search_term in key or key in search_term:
                            logger.info(f"Found partial match in mapping: '{key}' matches '{search_term}' -> ID {mapped_id}")
                            return await self.agent_open_product(context, str(mapped_id))
                    
                    # STEP 2: Use fuzzy matching with similarity scoring (handles variations and typos)
                    logger.info(f"No direct mapping found, trying fuzzy matching for: '{product_identifier}'")
                    
                    # Try fuzzy matching with threshold of 0.6 (60% similarity required)
                    fuzzy_match = await self._find_best_product_match(product_identifier, threshold=0.6)
                    
                    if fuzzy_match:
                        product_id, similarity_score, product_title = fuzzy_match
                        
                        # If similarity is very high (>= 0.75), auto-open immediately
                        if similarity_score >= 0.75:
                            logger.info(f"High confidence fuzzy match (score: {similarity_score:.2f}), auto-opening")
                            return await self.agent_open_product(context, str(product_id))
                        
                        # If moderate similarity (0.6 - 0.75), confirm with user
                        logger.info(f"Moderate confidence match (score: {similarity_score:.2f}), asking for confirmation")
                        return f"وجدت منتج يمكن أن يكون هو المطلوب:\n\n{product_title} (رقم {product_id})\n\nهل هذا هو المنتج اللي تبحث عنه؟ قول 'نعم' أو 'افتح رقم {product_id}' للتأكيد."
                    
                    # STEP 3: If fuzzy matching didn't work, fall back to semantic search
                    logger.info(f"Fuzzy matching below threshold, using semantic search for: '{product_identifier}'")
                    
                    # Search with k=5 to get better matches
                    services = await self._fetch_services_from_api(
                        query=product_identifier,
                        k=5
                    )

                    if not services:
                        return f"ما لقيت منتج باسم '{product_identifier}'. جرب تبحث بطريقة ثانية أو قول 'ورّيني المنتجات المتاحة'."

                    # If we found exactly one match, open it automatically
                    if len(services) == 1:
                        product_id = services[0]['serviceId']
                        logger.info(f"Found single result via semantic search, auto-opening product ID: {product_id}")
                        return await self.agent_open_product(context, str(product_id))

                    # If top result has very high relevance (semantic search), auto-open it
                    # Check if the product name appears in the title (case insensitive)
                    if len(services) > 1:
                        top_match = services[0]
                        if product_identifier.lower() in top_match['name'].lower() or top_match['name'].lower() in product_identifier.lower():
                            product_id = top_match['serviceId']
                            logger.info(f"Found strong substring match in semantic search results, auto-opening product ID: {product_id}")
                            return await self.agent_open_product(context, str(product_id))

                    # Multiple matches - show top 3 options
                    response = f"لقيت {len(services)} منتجات مشابهة لـ '{product_identifier}':\n\n"
                    for i, service in enumerate(services[:3], 1):
                        cost = service.get('price', 'غير محدد')
                        response += f"{i}. {service['name']}\n"
                        response += f"   السعر: {cost} ريال | الرقم: {service['serviceId']}\n\n"

                    response += "\nأي واحد تبي أفتحه لك؟ قول الرقم أو الاسم."
                    return response
            
            @function_tool
            async def agent_get_page_info(
                self,
                context: RunContext[NaamaUserData]
            ) -> str:
                """Get information about the current page and available actions."""
                page_info = {
                    "home": {
                        "name": "الصفحة الرئيسية",
                        "actions": ["تصفح المنتجات", "البحث عن منتج", "عرض سلة التسوق", "شوف العروض"]
                    },
                    "services": {
                        "name": "كتالوج المنتجات",
                        "actions": ["البحث عن منتج", "تصفية المنتجات", "فتح منتج معين", "العودة للرئيسية"]
                    },
                    "cart": {
                        "name": "سلة التسوق",
                        "actions": ["عرض المنتجات في السلة", "حذف منتج من السلة", "تعديل الكميات", "إتمام الطلب", "مواصلة التسوق"]
                    },
                    "checkout": {
                        "name": "إتمام الطلب",
                        "actions": ["تأكيد الطلب", "تعديل العنوان", "اختيار طريقة الدفع", "مواصلة التسوق", "العودة للسلة"]
                    },
                    "profile": {
                        "name": "الملف الشخصي",
                        "actions": ["عرض الطلبات", "تعديل البيانات", "الإعدادات", "العودة للرئيسية"]
                    },
                    "signin": {
                        "name": "تسجيل الدخول",
                        "actions": ["تسجيل الدخول", "إنشاء حساب جديد", "استرجاع كلمة المرور"]
                    },
                    "signup": {
                        "name": "إنشاء حساب",
                        "actions": ["إنشاء حساب جديد", "تسجيل الدخول", "العودة للرئيسية"]
                    },
                    "product_detail": {
                        "name": f"تفاصيل المنتج {context.userdata.current_service_id}",
                        "actions": ["إضافة للسلة", "شراء الآن", "العودة للمنتجات", "البحث عن منتج مشابه"]
                    }
                }

                current = page_info.get(context.userdata.current_page, {})
                response = f"أنت الحين في {current.get('name', 'صفحة غير معروفة')}.\n"
                response += "تقدر:\n"
                for action in current.get('actions', []):
                    response += f"- {action}\n"

                return response
            
            @function_tool
            async def agent_list_products(
                self,
                context: RunContext[NaamaUserData],
                limit: int = 5,
                category: Optional[str] = None,
                brand: Optional[str] = None
            ) -> str:
                """
                List available products with basic information.

                Args:
                    limit: Maximum number of products to show (default 5)
                    category: Optional category filter (e.g., "الإلكترونيات", "الأزياء والموضة")
                    brand: Optional brand filter (e.g., "Apple", "Samsung")
                """

                # Navigate to services if not there
                if context.userdata.current_page != "services":
                    await self.agent_navigate_to_page(context, "services")

                # Fetch products from API
                services = await self._fetch_services_from_api(
                    category=category
                )

                if not services:
                    return "عذراً، ما قدرت أجيب قائمة المنتجات الحين. تأكد إن الخادم شغال."

                total_count = len(services)
                services_to_show = services[:limit]

                if category:
                    response = f"إليك المنتجات في فئة '{category}':\n\n"
                elif brand:
                    response = f"إليك منتجات '{brand}':\n\n"
                else:
                    response = f"عندنا {total_count} منتج متوفر، إليك أفضلها:\n\n"

                for i, service in enumerate(services_to_show, 1):
                    cost = service.get('price', 'غير محدد')
                    category_name = service.get('category', 'غير محدد')
                    response += f"{i}. {service['name']}\n"
                    response += f"   السعر: {cost} ريال | الفئة: {category_name}\n\n"

                if total_count > limit:
                    response += f"... وفيه {total_count - limit} منتج آخر\n\n"

                response += "تبي تفتح أي منتج؟ قول الرقم أو ابحث عن منتج معين."
                return response

            @function_tool
            async def agent_show_products_by_filter(
                self,
                context: RunContext[NaamaUserData],
                filter_description: str,
                category: Optional[str] = None,
                sector: Optional[str] = None,
                audience: Optional[str] = None,
                limit: int = 10
            ) -> str:
                """
                Show products filtered by category, sector, or audience with smart filtering.
                Use this when user asks to see products for specific categories or audiences.

                Args:
                    filter_description: Natural language description of what to filter (for voice response)
                    category: Product category (e.g., "الإلكترونيات", "الأزياء والموضة", "المنزل والمطبخ")
                    sector: Product sector (if applicable)
                    audience: Target audience (e.g., "أفراد", "قطاع أعمال", "الجمعيات التطوعية")
                    limit: Maximum number of products to show (default 10)
                """
                logger.info(f"Filtering products: category={category}, sector={sector}, audience={audience}")

                # Navigate to services page first
                if context.userdata.current_page != "services":
                    await self.agent_navigate_to_page(context, "services")

                # Fetch filtered products from API
                services = await self._fetch_services_from_api(
                    category=category,
                    # sub_category and audience removed in new schema
                )

                if not services:
                    return f"ما لقيت منتجات {filter_description}. جرب فئة ثانية أو قول 'ورّيني كل المنتجات'."

                total_count = len(services)
                services_to_show = services[:limit]

                # Build response based on filter type
                if category:
                    response = f"عندنا {total_count} منتج في فئة {category}:\n\n"
                elif audience:
                    response = f"عندنا {total_count} منتج مخصص لـ {audience}:\n\n"
                elif sector:
                    response = f"عندنا {total_count} منتج في قطاع {sector}:\n\n"
                else:
                    response = f"عندنا {total_count} منتج {filter_description}:\n\n"

                for i, service in enumerate(services_to_show, 1):
                    cost = service.get('price', 'غير محدد')
                    category_name = service.get('category', 'غير محدد')
                    response += f"{i}. {service['name']}\n"
                    response += f"   السعر: {cost} ريال | الفئة: {category_name}\n"
                    response += f"   الرقم: {service['serviceId']}\n\n"

                if total_count > limit:
                    response += f"\n... وفيه {total_count - limit} منتج آخر في هذه الفئة\n\n"

                response += "تبي أفتح أي منتج؟ قول الرقم أو الاسم."
                return response

            @function_tool
            async def agent_add_to_cart(
                self,
                context: RunContext[NaamaUserData],
                product_id: int,
                quantity: int = 1
            ) -> str:
                """
                Add a product to the shopping cart.

                Args:
                    product_id: Product ID to add
                    quantity: Quantity to add (default 1)
                """
                # Get product details
                service = await self._get_service_by_id(str(product_id))

                if not service:
                    return f"ما قدرت ألقى المنتج رقم {product_id}"

                # Send add to cart RPC
                cart_data = {
                    "action": "add_to_cart",
                    "product_id": product_id,
                    "quantity": quantity
                }

                result = await self._send_rpc_to_frontend(context, "client.cart", cart_data)

                if "Successfully" in result:
                    product_name = service['name']
                    cost = service.get('price', 'غير محدد')
                    return f"تمام! أضفت {product_name} للسلة ({quantity} قطعة)\nالسعر: {cost} ريال\n\nتبي تكمل تسوق أو تشوف السلة؟"

                return result
