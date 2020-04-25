/// <reference types="node" />
import stream from 'stream';
export declare function createTransformStreams(): [stream.Transform, stream.Transform];
export default class Analyzer {
    private options;
    private startingPoints;
    constructor(options?: string[], startingPoints?: string[]);
    analyze(): Promise<number>;
}
