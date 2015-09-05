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
		new FrameAnimationImport(false);
		#elseif jsfl_mergence
		new FrameAnimationImport(true);
		#end
	}
	public function new(layerMergence:Bool)
	{
		if(Lib.fl.getDocumentDOM() == null) return;
		Lib.fl.trace("--- FrameAnimationImport ---");

		var frameAnimationExportFolerURI = fl.browseForFolderURL('Select ${FileDirectory.OUTPUT_DIRECTORY}.');
		if(frameAnimationExportFolerURI == null){
			return;
		}
		var information = JsonReader.getInformation(frameAnimationExportFolerURI);
		if(information == null){
			Lib.fl.trace('not found: ${FileDirectory.getInfomationFilePath(frameAnimationExportFolerURI)}}}');
			return;
		}
		var directoryStructure = JsonReader.getDirectoryStruture(frameAnimationExportFolerURI);

		var document = fl.getDocumentDOM();
		var assetsImport = new AssetsImport(document, frameAnimationExportFolerURI, directoryStructure);
		assetsImport.execute();

		var layerStructure = JsonReader.getLayerStructure(frameAnimationExportFolerURI);
		var layerIndex = JsonReader.getLayerIndex(frameAnimationExportFolerURI);

		var movieClipCreation = new MovieClipCreation(information, document, layerStructure, layerIndex);
		movieClipCreation.execute();

		if(layerMergence)
			LayerMargence.execute(document);

		Lib.fl.trace("finish");
	}
}
