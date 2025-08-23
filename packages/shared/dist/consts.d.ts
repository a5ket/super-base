export declare const superheroConstraints: {
    readonly nickname: {
        readonly min: 1;
        readonly max: 100;
    };
    readonly realName: {
        readonly min: 1;
        readonly max: 100;
    };
    readonly originDescription: {
        readonly min: 10;
        readonly max: 2000;
    };
    readonly superpowers: {
        readonly min: 5;
        readonly max: 1000;
    };
    readonly catchPhrase: {
        readonly min: 1;
        readonly max: 500;
    };
    readonly imageCaption: {
        readonly max: 200;
    };
    readonly imageUrl: {
        readonly max: 500;
    };
};
export declare const pagination: {
    readonly page: 1;
    readonly limit: 5;
    readonly maxLimit: 50;
};
export declare const sortDefaults: {
    readonly fields: readonly ["nickname", "realName", "createdAt", "updatedAt"];
    readonly orders: readonly ["asc", "desc"];
    readonly field: "createdAt";
    readonly order: "desc";
};
export declare const imageDefaults: {
    readonly isPrimary: false;
};
export declare const imageConstraints: {
    readonly size: number;
    readonly width: {
        readonly min: 100;
        readonly max: 4000;
    };
    readonly height: {
        readonly min: 100;
        readonly max: 4000;
    };
    readonly mimeTypes: readonly ["image/jpeg", "image/png", "image/webp"];
};
