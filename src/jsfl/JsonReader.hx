package;

import lib.Information;
import lib.PhotoshopLayer;
import jsfl.FLfile;
import lib.Directory;
import lib.FileDirectory;

class JsonReader
{
	public static function getInformation(frameAnimationExportFolerURI:String):Information
	{
		var jsonURI = FileDirectory.getInfomationFilePath(frameAnimationExportFolerURI);
		return cast read(jsonURI);
	}
	public static function getDirectoryStruture(frameAnimationExportFolerURI:String):Directory
	{
		var jsonURI = FileDirectory.getDirectoryStructureFilePath(frameAnimationExportFolerURI);
		return cast read(jsonURI);
	}
	public static function getLayerStructure(frameAnimationExportFolerURI:String):Array<Array<PhotoshopLayer>>
	{
		var jsonURI = FileDirectory.getLayerStructureFilePath(frameAnimationExportFolerURI);
		return cast read(jsonURI);
	}
	public static function getLayerIndex(frameAnimationExportFolerURI:String):Array<String>
	{
		var jsonURI = FileDirectory.getLayerIndexFilePath(frameAnimationExportFolerURI);
		return cast read(jsonURI);
	}
	private static function read(jsonURI)
	{
		var jsonString = FLfile.read(jsonURI);
		if(jsonString == null || jsonString == ""){
			return null;
		}
		return js.Lib.eval(["(", jsonString, ")"].join(""));
	}
}
