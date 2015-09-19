package ;
import jsfl.Document;
import jsfl.Timeline;
class LayerMergence
{
	public static function execute(document:Document, filename:String)
	{
		var timeline = document.getTimeline();
		if(timeline.layerCount <= 1) return;

		var maxLayerIndex = timeline.layerCount - 1;

		for(frameIndex in 0...timeline.frameCount)
		{
			timeline.currentFrame = frameIndex;
			document.selectAll();

			document.clipCut();
			timeline.currentLayer = maxLayerIndex;
			document.clipPaste(true);

		}
		for(i in 0...maxLayerIndex)
		{
			timeline.deleteLayer(0);
		}

		timeline.layers[0].name = filename;
	}
}
