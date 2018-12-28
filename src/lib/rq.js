import request from 'request-promise';

const rq = async(url, binary = false) => {
  return request({
    url,
    encoding: binary ? 'binary' : null,
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; WebView/3.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
      'x-requested-with': 'XMLHttpRequest',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8', // eslint-disable-line
      'accept-language': 'en-GB,en;q=0.9,pt-PT;q=0.8,pt;q=0.7,en-US;q=0.6',
      'cache-control': 'no-cache'
    }
  });
};

export default rq;
