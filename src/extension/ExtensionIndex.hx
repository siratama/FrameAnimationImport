package;

import flash_extension.csinterface.CSInterfaceUtil;
import jQuery.JQuery;
import js.Browser;

class ExtensionIndex
{
	private var csInterfaceUtil:CSInterfaceUtil;
	private static inline var JSFL_CLASS_NAME = "LibraryItemDuplication";
	private static inline var JSFL = JSFL_CLASS_NAME + ".jsfl";

	private var folderCopyNameRuleElement:JQuery;
	private var fileCopyNameRuleElement:JQuery;
	private static inline var SLIDE_SPEED = "fast";

	public static function main(){
		new ExtensionIndex();
	}
	public function new(){
		Browser.window.addEventListener("load", initialize);
	}
	private function initialize(event)
	{
		csInterfaceUtil = CSInterfaceUtil.create();

		var copyNameRuleElement = new JQuery("#copy_name_rule");
		folderCopyNameRuleElement = new JQuery(".folder", copyNameRuleElement);
		folderCopyNameRuleElement.val(Common.DEFALUT_FOLDER_COPY_NAME);
		fileCopyNameRuleElement = new JQuery(".file", copyNameRuleElement);

		setTitleBar("copy_name_rule_title", copyNameRuleElement);

		var runButtonElement = new JQuery("#run");
		runButtonElement.mousedown(function(event){
			run();
		});
	}
	private function setTitleBar(titleBarId:String, slideElement:JQuery){

		var titleElement = new JQuery("#" + titleBarId);
		titleElement.mousedown(function(event)
		{
			if(slideElement.is(":hidden"))
				slideElement.slideDown(SLIDE_SPEED);
			else
				slideElement.slideUp(SLIDE_SPEED);
		});
	}
	private function run()
	{
		var folderCopyName = folderCopyNameRuleElement.val();
		if(folderCopyName == ""){
			csInterfaceUtil.flTrace("Set folder copy name rule.");
			return;
		}

		var fileCopyName = fileCopyNameRuleElement.val();
		csInterfaceUtil.evalScript('new $JSFL_CLASS_NAME("$folderCopyName", "$fileCopyName");');
	}
}

