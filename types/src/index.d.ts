export declare function glslLoader(options: any): {
    name: string;
    version: string;
    options(options: any): Promise<void>;
    load(id: any): Promise<string>;
};
