package ;
import jsfl.Library;
import lib.FileDirectory;
class ImportFolder
{
	public static var instance(get, null):ImportFolder;
	private static inline function get_instance():ImportFolder
		return instance == null ? instance = new ImportFolder(): instance;
	private function new(){}

	public var name(default, null):String;
	public var movieclipName(default, null):String;

	public function initialize(library:Library, filename:String)
	{
		var psdName = filename.split(FileDirectory.PSD_EXTENSION)[0];
		movieclipName = psdName;

		var count = 0;
		while(true)
		{
			var checkFolderName = (count == 0) ? psdName: psdName + Std.string(count);
			if(!library.itemExists(checkFolderName)){
				library.newFolder(checkFolderName);
				this.name = checkFolderName;
				break;
			}
			count++;
		}
	}
}
