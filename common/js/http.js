// const baseUrl = 'https://shuxuejisuan-api.sinmore.vip:8443' // 测试域名
const baseUrl = 'https://www.fudian.co:8443' // 正式域名

const request = (options = {}) => {
	// 在这里可以对请求头进行一些设置
	// 例如：
	// options.header = {
	// 	"Content-Type": "application/json"
	// }
	const access_token = uni.getStorageSync('token')
	const Cookie = uni.getStorageSync('cookie')
	if (access_token) {
		options.header = {
			"Authorization": access_token,
			"Cookie": Cookie,
			"content-type": 'application/x-www-form-urlencoded'
		}
	} else {
		options.header = {
			"content-type": 'application/x-www-form-urlencoded'
		}
	}
	
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + options.url || '',
			method: options.type || 'GET',
			data: options.data || {},
			header: options.header || {}      
		}).then(data => {
			console.log(data)
			let [err, res] = data;
			 if (res && res.cookies && res.cookies[0]) {
				uni.setStorageSync("cookie", res.cookies[0])
			 }
			if (res.data.code == 412 || res.data.code == 401) {
				uni.redirectTo({
					url: "/pages/login/index"
				})
			} else if (res.data.code == 200) {
				resolve(res.data)
			} else if (res.data.code == 500) {
				uni.showToast({
					title: res.data.msg,
					duraion: 1500,
					icon: 'none'
				})
				reject(res)
			} else {
				uni.showToast({
					title: '未知错误500',
					duraion: 1500,
					icon: 'none'
				})
				reject(error)
			}		
		}).catch(error => {
			// uni.showToast({
			// 	title: '未知错误500',
			// 	duraion: 1500,
			// 	icon: 'none'
			// })
			uni.redirectTo({
				url: '/pages/login/index'
			})
			reject(error)
		})
	})
}

 const get = (url, data, options = {}) => {
	 // console.log(data)
	options.type = 'GET'
	options.data = data
	options.url = url
	return request(options)
}

const post = (url, data, options = {}) => {
	options.type = 'POST'
	options.data = data
	options.url = url
	options.dataType = 'application/x-www-form-urlencoded'
	return request(options)
}
const put = (url, data, options = {}) => {
	options.type = 'PUT'
	options.data = data
	options.url = url
	options.dataType = 'application/x-www-form-urlencoded'
	return request(options)
}
function formData (obj = {}) {
	let result = ''
	  for (let name of Object.keys(obj)) {
	    let value = obj[name];
	    result += 
	    '\r\n--XXX' +
	    '\r\nContent-Disposition: form-data; name=\"'+ name +'\"'+ 
	    '\r\n' +
	    '\r\n' + value
	  }
	  return result + '\r\n--XXX--'
}

export default {
	request,
	get,
	post,
	put,
	baseUrl
}