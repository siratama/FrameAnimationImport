package;

import lib.FileDirectory;
import jsfl.Library;
import jsfl.Lib;
import jsfl.Lib.fl;

@:expose("FrameAnimationImport")
class FrameAnimationImport
{
	private var library:Library;

	public static function main(){
		#if jsfl
		new FrameAnimationImport();
		#end
	}
	public function new()
	{
		if(Lib.fl.getDocumentDOM() == null) return;
		Lib.fl.trace("--- FrameAnimationImport ---");

		var frameAnimationExportFolerURI = fl.browseForFolderURL('Select ${FileDirectory.OUTPUT_DIRECTORY}.');
		if(frameAnimationExportFolerURI == null){
			return;
		}

		var directoryStructure = JsonReader.getDirectoryStruture(frameAnimationExportFolerURI);
		if(directoryStructure == null){
			Lib.fl.trace('not found: ${FileDirectory.getDirectoryStructureDefaultFilePath(frameAnimationExportFolerURI)}}}');
			return;
		}

		var document = fl.getDocumentDOM();
		var assetsLoader = new AssetsLoader(document, frameAnimationExportFolerURI, directoryStructure);
		assetsLoader.execute();

		var layerStructure = JsonReader.getLayerStructure(frameAnimationExportFolerURI);
		var test = new Test(document, layerStructure);
		test.execute();
	}
}
