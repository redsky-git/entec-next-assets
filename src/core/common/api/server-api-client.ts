class ApiClient {
	static instance: ApiClient;

	// 싱글톤 인스턴스 반환
	static getInstance() {
		if (!this.instance) {
			this.instance = new ApiClient();
		}
		return this.instance;
	}
}

export default ApiClient.getInstance();
