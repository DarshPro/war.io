gameData.Map = function (type, size, vegetation, initialResources) {
	this.t = type;//standard, random, campaign, ...
	this.size = size;//small, normal, large, ...
	this.ve = vegetation;//plain, forest, mediteranean, desert...
	this.ir = initialResources;//amount of resources at game start
}
