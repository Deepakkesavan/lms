import { Injectable, Inject, Optional } from '@angular/core';
import { LocationStrategy, PathLocationStrategy, PlatformLocation, APP_BASE_HREF } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SilentLocationStrategyService extends PathLocationStrategy {
    private _internalUrl: string = '/';

    constructor(
        private platformLocation: PlatformLocation,
        @Optional() @Inject(APP_BASE_HREF) href?: string
    ) {
        super(platformLocation, href);
        // Initialize internal URL from current window location or state if available
        const initialState = this.platformLocation.getState() as { internalUrl?: string } | null;
        if (initialState && initialState.internalUrl) {
            this._internalUrl = initialState.internalUrl;
        } else {
            // If no state (e.g. fresh load or external link), capture the current full path
            this._internalUrl = this.platformLocation.pathname + this.platformLocation.search;

            // Immediately replace the history entry to hide the deep link from the address bar
            const base = this.getBaseUrl();
            if (window.location.pathname !== base) {
                this.platformLocation.replaceState(null, '', base);
            }
        }
    }

    private getBaseUrl(): string {
        const path = window.location.pathname;
        const segments = path.split('/');
        // segments[0] is empty, segments[1] is the first path part
        if (segments.length > 1 && segments[1]) {
            return `/${segments[1]}`;
        }
        return '/';
    }

    override path(includeHash?: boolean): string {
        return this._internalUrl;
    }

    override pushState(state: any, title: string, url: string, queryParams: string): void {
        const internalFullUrl = queryParams ? `${url}?${queryParams}` : url;
        this._internalUrl = internalFullUrl;

        // Always force the visible URL to be the base
        const visibleUrl = this.getBaseUrl();

        // Store the logical internal URL in the state so we can restore it on PopState
        const newState = { ...state, internalUrl: this._internalUrl };

        this.platformLocation.pushState(newState, title, visibleUrl);
    }

    override replaceState(state: any, title: string, url: string, queryParams: string): void {
        const internalFullUrl = queryParams ? `${url}?${queryParams}` : url;
        this._internalUrl = internalFullUrl;

        const visibleUrl = this.getBaseUrl();
        const newState = { ...state, internalUrl: this._internalUrl };

        this.platformLocation.replaceState(newState, title, visibleUrl);
    }

    override onPopState(fn: (value: any) => void): void {
        this.platformLocation.onPopState((event: any) => {
            const state = event.state as { internalUrl?: string };
            if (state && state.internalUrl) {
                this._internalUrl = state.internalUrl;
            } else {
                this._internalUrl = '/';
            }
            fn(event);
        });
    }
}
