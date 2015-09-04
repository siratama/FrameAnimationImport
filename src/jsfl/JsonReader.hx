package;

import lib.PhotoshopLayer;
import jsfl.FLfile;
import lib.Directory;
import lib.FileDirectory;

class JsonReader
{
	public static function getDirectoryStruture(frameAnimationExportFolerURI:String):Directory
	{
		var jsonURI = FileDirectory.getDirectoryStructureDefaultFilePath(frameAnimationExportFolerURI);

		var jsonString = FLfile.read(jsonURI);
		if(jsonString == null){
			return null;
		}
		var directoryStructure:Directory = js.Lib.eval(["(", jsonString, ")"].join(""));
		return directoryStructure;
	}

	public static function getLayerStructure(frameAnimationExportFolerURI:String):Array<Array<PhotoshopLayer>>
	{
		var jsonURI = FileDirectory.getLayerStructureDefaultFilePath(frameAnimationExportFolerURI);

		var jsonString = FLfile.read(jsonURI);
		if(jsonString == null){
			return null;
		}

		var layerStructure:Array<Array<PhotoshopLayer>> = js.Lib.eval(["(", jsonString, ")"].join(""));
		return layerStructure;
	}
}
