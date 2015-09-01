package;
class Symbol
{
	public var name(default, null):String;
	public var originalItemPath(default, null):String;
	public var duplicationItemPath(default, null):String;
	public var copiedBaseDirectoryPath(default, null):String;

	public function new(name:String, copiedBaseDirectoryPath:String, originalItemPath:String, duplicationItemPath:String)
	{
		this.copiedBaseDirectoryPath = copiedBaseDirectoryPath;
		this.duplicationItemPath = duplicationItemPath;
		this.originalItemPath = originalItemPath;
		this.name = name;
	}
}
