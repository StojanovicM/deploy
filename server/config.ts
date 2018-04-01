let env = process.env.NODE_ENV;

let config: IConfig = {
	port: +process.env.PORT || 7000,
	db: {
		client: 'mysql2',
		connection: {
			host: '127.0.0.1',
			user: 'deploy',
			password: 'test',
			database: 'deploy'
		}
	}
}

export let Config: IConfig = config;

interface IConfig {
	port: number,
	db: {
		client :string,
		connection :{
			host :string
			user :string
			password :string
			database :string
		} 
	}
}

