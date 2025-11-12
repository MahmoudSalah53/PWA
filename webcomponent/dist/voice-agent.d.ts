import { CSSResult } from 'lit';
import { LitElement } from 'lit';
import { TemplateResult } from 'lit';

export declare class VoiceAgentComponent extends LitElement {
    backendUrl: string;
    livekitUrl: string;
    tokenEndpoint: string;
    showTestButtons: boolean;
    private _isConnected;
    private _isConnecting;
    private currentCommand;
    private isAgentSpeaking;
    private audioLevel;
    private room;
    private audioElement;
    private audioMeter;
    private token;
    private roomName;
    constructor();
    static styles: CSSResult;
    disconnectedCallback(): void;
    private cleanup;
    private searchProductByName;
    private handleNavigation;
    private handleSearch;
    private handleProductSearch;
    private handleFilter;
    private connectToLiveKit;
    private disconnectFromLiveKit;
    private getFreshToken;
    private toggleConnection;
    private renderSiriPulseCircle;
    render(): TemplateResult<1>;
}

export { }


declare global {
    interface HTMLElementTagNameMap {
        'voice-agent': VoiceAgentComponent;
    }
}

