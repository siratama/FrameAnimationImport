package ;
import lib.FileDirectory;
import lib.Information;
import jsfl.Timeline;
import jsfl.LayerType;
import lib.FileDirectory;
import jsfl.ItemType;
import lib.PhotoshopLayer;
import jsfl.Library;
import jsfl.Document;

class MovieClipCreation
{
	private var document:Document;
	private var library:Library;
	private var layerStructure:Array<Array<PhotoshopLayer>>;
	private var layerIndex:Array<String>;
	private var timeline:Timeline;

	public function new(document:Document, layerStructure:Array<Array<PhotoshopLayer>>, layerIndex:Array<String>)
	{
		this.layerIndex = layerIndex;
		this.layerStructure = layerStructure;
		this.document = document;

		library = document.library;
	}
	public function execute()
	{
		createMovieClip();
		createLayerFrame();
		putElement();
	}
	private function createMovieClip()
	{
		var movieClipPath = [ImportFolder.instance.name, ImportFolder.instance.movieclipName].join(FileDirectory.PATH_COLUMN);
		library.addNewItem(ItemType.MOVIE_CLIP, movieClipPath);
		library.editItem();
		timeline = document.getTimeline();
	}
	private function createLayerFrame()
	{
		var totalFrames = layerStructure.length - 1;
		timeline.insertFrames(totalFrames, true);

		for(path in layerIndex)
		{
			timeline.addNewLayer(path, LayerType.NORMAL, false);
		}
		for(i in 0...timeline.layerCount)
		{
			timeline.currentLayer = i;
			for (frameIndex in 0...totalFrames) timeline.insertKeyframe(frameIndex);
		}
		//delete default layer
		timeline.deleteLayer(0);
	}
	private function putElement()
	{
		for (frameIndex in 0...layerStructure.length)
		{
			timeline.currentFrame = frameIndex;
			var photoshopLayerSet = layerStructure[frameIndex];

			var beforeLayerIndex:Null<Int> = null;
			for (photoshopLayerIndex in 0...photoshopLayerSet.length)
			{
				var photoshopLayer = photoshopLayerSet[photoshopLayerIndex];

				var layerIndexSet = timeline.findLayerIndex(photoshopLayer.path);
				var layerIndex:Int = getLayerIndex(beforeLayerIndex, layerIndexSet);

				timeline.currentLayer = layerIndex;
				beforeLayerIndex = layerIndex;

				var libraryItemPath = getLibraryItemPath(photoshopLayer);
				library.addItemToDocument({x:0, y:0}, libraryItemPath);

				document.setInstanceAlpha(photoshopLayer.opacity);
				document.setElementProperty("x", photoshopLayer.x);
				document.setElementProperty("y", photoshopLayer.y);
			}
		}
	}

	private function getLayerIndex(beforeLayerIndex:Null<Int>, layerIndexSet:Array<Int>):Int
	{
		if(beforeLayerIndex == null || layerIndexSet.length == 1)
			return layerIndexSet[0];

		var layerIndex = 0;
		for(i in 0...layerIndexSet.length)
		{
			layerIndex = layerIndexSet[i];
			if(layerIndex > beforeLayerIndex) break;
		}
		return layerIndex;
	}

	private function getLibraryItemPath(photoshopLayer:PhotoshopLayer):String
	{
		var pathSet = (photoshopLayer.directory == FileDirectory.ROOT_DIRECTORY) ?
			[
				ImportFolder.instance.name,
				FileDirectory.ASSETS_DIRECTORY,
				photoshopLayer.name
			] :
			[
				ImportFolder.instance.name,
				FileDirectory.ASSETS_DIRECTORY,
				photoshopLayer.directory,
				photoshopLayer.name
			];

		return pathSet.join(FileDirectory.PATH_COLUMN);
	}
}
