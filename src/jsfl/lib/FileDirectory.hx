package lib;
class FileDirectory
{
	public static inline var ROOT_DIRECTORY = "";
	public static inline var PATH_COLUMN = "/";
	public static inline var IMAGE_EXTENSION = ".png";
	public static inline var JSON_EXTENSION = ".json";

	public static inline var OUTPUT_DIRECTORY = "frame_animation_export";
	public static inline var ASSETS_DIRECTORY = "assets";
	public static inline var JSON_DIRECTORY = "json";

	public static inline var JSON_LAYER_STRUCTURE_DIRECTORY = "layer";
	public static inline var LAYER_STRUCTURE_DEFAULT_FILE = "default" + JSON_EXTENSION;
	public static inline var LAYER_STRUCTURE_ARRAY_FILE = "array" + JSON_EXTENSION;

	public static inline var JSON_DIRECTORY_STRUCTURE_DIRECTORY = "directory";
	public static inline var DIRECTORY_STRUCTURE_DEFAULT_FILE = "default" + JSON_EXTENSION;
	public static inline var DIRECTORY_STRUCTURE_PATH_FILE = "path" + JSON_EXTENSION;

	public static inline var BITMAP_DIRECTORY = "_bitmap";

	public static inline function getDirectoryStructureDefaultFilePath(frameAnimationExportFolerURI:String):String
	{
		return [
			frameAnimationExportFolerURI,
			JSON_DIRECTORY,
			JSON_DIRECTORY_STRUCTURE_DIRECTORY,
			DIRECTORY_STRUCTURE_DEFAULT_FILE
		].join(PATH_COLUMN);
	}
	public static inline function getAssetsDirectoryPath(frameAnimationExportFolerURI:String):String
	{
		return [
			frameAnimationExportFolerURI,
			ASSETS_DIRECTORY
		].join(PATH_COLUMN);
	}

	public static inline function getLayerStructureDefaultFilePath(frameAnimationExportFolerURI:String):String
	{
		return [
			frameAnimationExportFolerURI,
			JSON_DIRECTORY,
			JSON_LAYER_STRUCTURE_DIRECTORY,
			LAYER_STRUCTURE_DEFAULT_FILE
		].join(PATH_COLUMN);
	}
}