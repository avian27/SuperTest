export class EnvironmentConfiguration {
    static configs = new Map([
        ["XCATALOGZ0", "api.sit.xcatalogz0.de"],
        ["XCATALOGZ5", "api.xcatalogz5.de"]
    ]);

    static getURL(key) {
        return this.configs.get(key);
    }
}

