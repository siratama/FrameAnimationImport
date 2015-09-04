package ;
import jsfl.Timeline;
import jsfl.LayerType;
import lib.FileDirectory;
import jsfl.ItemType;
import lib.PhotoshopLayer;
import jsfl.Library;
import jsfl.Document;

class Test
{
	private var document:Document;
	private var library:Library;
	private var layerStructure:Array<Array<PhotoshopLayer>>;
	private var timeline:Timeline;

	public function new(document:Document, layerStructure:Array<Array<PhotoshopLayer>>)
	{
		this.layerStructure = layerStructure;
		this.document = document;
		library = document.library;
		timeline = document.getTimeline();
	}

	public function execute()
	{
		var psdFileName = "test_movieclip";
		library.addNewItem(ItemType.MOVIE_CLIP, psdFileName);
		library.editItem();

		createLayerFrame();
	}
	private function createLayerFrame()
	{
		timeline.insertFrames(layerStructure.length, true);

		for (frameIndex in 0...layerStructure.length)
		{
			var photoshopLayerSet = layerStructure[frameIndex];

			for (elementIndex in 0...photoshopLayerSet.length)
			{
				var photoshopLayer = photoshopLayerSet[elementIndex];

				var layerIndexSet = timeline.findLayerIndex(photoshopLayer.name);
				var layerIndex = (layerIndexSet == null) ?
					timeline.addNewLayer(photoshopLayer.name, LayerType.NORMAL, false):
					layerIndexSet[0];

				timeline.currentLayer = layerIndex;
				var layer = timeline.layers[layerIndex];

				/*
				var libraryItemPath = [
					FileDirectory.OUTPUT_DIRECTORY,
					photoshopLayer.directory,
					photoshopLayer.name
				].join(FileDirectory.PATH_COLUMN);

				library.addItemToDocument({x:0, y:0}, libraryItemPath);

				var element = layer.frames[frameIndex].elements[elementIndex];
				element.x = photoshopLayer.x;
				element.y = photoshopLayer.y;
				*/
			}
		}
		timeline.selectAllFrames();
		timeline.insertKeyframe();
	}
}
