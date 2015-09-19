package;

import flash_extension.csinterface.CSInterfaceUtil;
import jQuery.JQuery;
import js.Browser;

class ExtensionIndex
{
	private var csInterfaceUtil:CSInterfaceUtil;
	private static inline var JSFL_CLASS_NAME = "FrameAnimationImport";
	private static inline var JSFL = JSFL_CLASS_NAME + ".jsfl";

	public static function main(){
		new ExtensionIndex();
	}
	public function new(){
		Browser.window.addEventListener("load", initialize);
	}
	private function initialize(event)
	{
		csInterfaceUtil = CSInterfaceUtil.create();

		var runButtonElement = new JQuery("#run");
		runButtonElement.mousedown(function(event){
			run(false);
		});

		var runMergeButtonElement = new JQuery("#run_merge");
		runMergeButtonElement.mousedown(function(event){
			run(true);
		});
	}
	private function run(layerMergence:Bool)
	{
		csInterfaceUtil.evalScript('new $JSFL_CLASS_NAME($layerMergence);');
	}
}

