import { Asset } from "./Asset";

export type ProjectAsset = {
	path:string;
} & Asset

export type ProjectDescriptor = {
	name:string;
	description:string;
}

export type Project = {
	assets:ProjectAsset[];
} & ProjectDescriptor

