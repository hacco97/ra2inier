
// hash值计算逻辑
const SEED = [11.4, 41, 61.2, 13, 7.6, 22.1, 88, 1, 39, 51.4]
const len = SEED.length
function seed(seed: number) { return SEED[seed % len] }
const HASH = Symbol()

export interface IUniqueObject {
	readonly id: number
	readonly seed: number
	name: string
	version: number
	[HASH]?: number
}

export class UniqueObject implements IUniqueObject {
	[key: string | symbol]: any
	/**
	 * id值，对象可以根据id值判断其创建的时间戳
	 */
	readonly id: number
	/**
	 * 种子值，部分对象可能具有相同的创建时间戳，使用seed加以区分
	 */
	readonly seed: number
	/**
	 * 对象的版本值，对象在修改的时候的时间戳
	 */
	readonly version: number
	/**
	 * 对象对外可见的名字
	 */
	name: string

	constructor(name?: string, seed?: number, version?: number) {
		this.id = Date.now()
		this.seed = Math.ceil(Math.random() * (seed || this.id))
		this.version = version || Date.now()
		this.name = name ?? 'NULL'
	}

	/**
	 * 对象的唯一身份标识
	 */
	get key() {
		return `${this.id}!${this.seed}`
	}

	/**
	 * 对象的唯一身份标识，简化版
	 */
	get hash() {
		if (this[HASH]) return this[HASH]
		return this[HASH] = UniqueObject.getHash(this)
	}

	/**
	 * 对外有重名时，使用全名可以加以区分
	 */
	get fullname() {
		return `${this.name}.${this.hash}.${this.version.toString(36)}`
	}

	static getKey(object: UniqueObject) {
		return `${object.id}!${object.seed}`
	}

	static getHash(object: UniqueObject) {
		const id = seed(object.id) * seed(object.seed)
		let hash = Math.abs(id + object.id + object.seed)
		while (hash > 999_999) hash /= 9.3
		while (hash < 100_000) hash *= 9.3
		return Math.floor(hash)
	}

	static getFullname(object: UniqueObject) {
		return `${object.name}.${UniqueObject.getHash(object)}.${object.version.toString(36)}`
	}

	static getVString(version: number) {
		const d = new Date(version)
		return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
	}

	static update(object: UniqueObject) {
		Reflect.set(object, 'version', Date.now())
	}
}

export function isUniqueObject(object: any) {
	if (object)
		if (object.id && object.seed)
			if (typeof object.id === 'number')
				if (typeof object.seed === 'number')
					return true
	return false
}

export interface Entry {
	/**
	 * 对应word的名字
	 */
	wordName: string,
	/**
	 * word对应的值，可以有多个值，中间用逗号分开
	 */
	values: string[],
	/**
	 * 给该词条可选的评论
	 */
	comment?: string
}

export class IniObject extends UniqueObject {
	/**
	 * 默认的scope名字值
	 */
	static DEFAULT_SCOPE_NAME = 'NullTypes'

	/**
	 * 两级分组
	 */
	group: string = ''
	/**
	 * 记录scope对象的name值
	 */
	scope: string = IniObject.DEFAULT_SCOPE_NAME
	/**
	 * 记录词条数据
	 */
	entry: Entry[] = []
	/**
	 * 记录内联对象的key值
	 */
	inline: string[] = []
	/**
	 * 记录副本对象的key值
	 */
	copy: string[] = []
	/**
	 *  记录对象级别的信息
	 */
	detail = ''
	/**
	 * 局部变量
	 */
	envVariable: Record<string, string> = {}

	constructor(name = 'NEW_INIOBJECT') {
		super(name)
	}
}
