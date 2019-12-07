'use strict';

const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const charset = require('charset');

module.exports = {

  getKumyeongSingerList: async (params) => {
    const requestOptions = {
      uri: `http://www.ikaraoke.kr/isong/search_singer.asp?sch_sel=9&sch_txt=${escape(iconv.encode(params.search, 'EUC-KR').toString('binary')).toString()}`, //키워드는 EUC-KR로 인코딩
      method: 'GET',
      encoding: null, //한글 깨지는 문제를 위해 null로 설정
      timeout: 10000, //10초 이후 응답을 포기
    }

    return new Promise((resolve, reject) => {
      request(requestOptions, (err, response, body) => {
        const enc = charset(response.headers, body);
        const encodeBody = iconv.decode(body, enc);
        const data = [];

        const $ = cheerio.load(encodeBody);

        $('div.searchSingerList > ul > li').each((index, item) => data.push($(item).find('a').text()));

        resolve(data);
      });
    });
  },

  getKumyeongSingList: async (params) => {
    const requestOptions = {
      uri: `http://www.ikaraoke.kr/isong/search_musictitle.asp?page=1&sch_sel=0&sch_txt=${escape(iconv.encode(params.search, 'EUC-KR').toString('binary')).toString()}&c_ctry=KR`, //키워드는 EUC-KR로 인코딩
      method: 'GET',
      encoding: null, //한글 깨지는 문제를 위해 null로 설정
      timeout: 10000, //10초 이후 응답을 포기
    }

    return new Promise((resolve, reject) => {
      request(requestOptions, (err, response, body) => {
        const enc = charset(response.headers, body);
        const encodeBody = iconv.decode(body, enc);
        const data = [];

        const $ = cheerio.load(encodeBody);

        $('div.tbl_board > table > tbody > tr').each((index, item) => {
          const title = $(item).find('td.pl8 > a').attr('title');
          const sing_no = $(item).find('td.ac > em').text();
          const lyrics = $(item).find('td.ac > div.lyricsWrap > div.lyricsCont').text();
          const href = $(item).find('td.ac > a').attr('href');
          $(item).find('td.ac > div').remove('.lyricsWrap');
          $(item).find('td.ac > em').remove();
          const date = $(item).find('td.ac').text().replace(/[^0-9]/g, '');

          data.push({
            title,
            sing_no,
            lyrics,
            href,
            date
          });
        });

        console.log('등록된 곡 수 :: ', $('p.sear_re_num > strong').text());

        resolve(data);
      });
    });
  },

  getTjSingList: async (params) => {
    const requestOptions = {
      uri: `http://m.tjmedia.co.kr/tjsong/song_search_result.asp?strType=2&strText=${encodeURI(params.search)}&strCond=0&strSize02=100`,
      method: 'GET',
      encoding: null, //한글 깨지는 문제를 위해 null로 설정
      timeout: 10000, //10초 이후 응답을 포기
    }

    return new Promise((resolve, reject) => {
      request(requestOptions, (err, response, body) => {
        const enc = charset(response.headers, body);
        const encodeBody = iconv.decode(body, enc);
        const data = [];

        const $ = cheerio.load(encodeBody);

        $('table.board_type1 > tbody > tr').each((index, item) => {
          const sing_no = $(item).find('td').eq(0).text();
          const title = $(item).find('td').eq(1).text();
          const singer = $(item).find('td').eq(2).text();

          data.push({
            title,
            sing_no,
            singer
          });
        });

        resolve(data);
      });
    });
  }
}