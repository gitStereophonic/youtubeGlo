'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // экранная клавиатура
  {
    const keyboardButton = document.querySelector('.search-form__keyboard');
    const keyboard = document.querySelector('.keyboard');
    const closeKeyboard = document.getElementById('close-keyboard');
    const searchInput = document.querySelector('.search-form__input');

    const toggleKeyboard = () => {
      keyboard.style.top = keyboard.style.top ? '' : '50%';
    };

    const changeLanguage = (btn, lang) => {
      const Langs = {
        langRu: ['ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅', 'й', 'ц',
          'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ф', 'ы', 'в', 'а',
          'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь',
          'б', 'ю', '.', 'en', ' '
        ],
        langEn: ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅', 'q', 'w',
          'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'a', 's', 'd', 'f',
          'g', 'h', 'j', 'k', 'l', ';', '"', 'z', 'x', 'c', 'v', 'b', 'n', 'm',
          ',', '.', '/', 'ru', ' '
        ]
      };

      if (lang === 'en') {
        btn.forEach((elem, i) => {
          elem.textContent = Langs.langEn[i];
        });
      } else {
        btn.forEach((elem, i) => {
          elem.textContent = Langs.langRu[i];
        });
      }
    };

    const typing = event => {
      const { target } = event;
      if (target.tagName === 'BUTTON') {
        const buttons = [...keyboard.querySelectorAll('button')]
          .filter(b => b.style.visibility !== 'hidden');
        const contentButton = target.textContent.trim();
        if (target.id === 'keyboard-backspace') {
          searchInput.value = searchInput.value.slice(0, length - 1);
        } else if (contentButton === 'en' || contentButton === 'ru') {
          changeLanguage(buttons, contentButton);
        } else {
          searchInput.value += contentButton ? contentButton : ' ';
        }
      }
    };

    keyboardButton.addEventListener('click', toggleKeyboard);
    closeKeyboard.addEventListener('click', toggleKeyboard);
    keyboard.addEventListener('click', typing);
  }

  // меню
  {
    const burger = document.querySelector('.spinner');
    const sidebarMenu = document.querySelector('.sidebarMenu');

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      sidebarMenu.classList.toggle('rollUp');
    });

    sidebarMenu.addEventListener('click', event => {
      let target = event.target;
      target = target.closest('a[href="#"]');
      if (target) {
        const parentTarget = target.parentElement;
        sidebarMenu.querySelectorAll('li').forEach(item => {
          if (item === parentTarget) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  const youtuber = () => {
    const youtuberItems = document.querySelectorAll('[data-youtuber]');
    const youtuberModal = document.querySelector('.youTuberModal');
    const youtuberContainer = document.getElementById('youtuberContainer');

    const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
    const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

    const sizeVideo = () => {
      const ww = document.documentElement.clientWidth;
      const wh = document.documentElement.clientHeight;
      for (let i = 0; i < qw.length; ++i) {
        if (ww > qw[i]) {
          youtuberContainer.querySelector('iframe').style.cssText = `
            width: ${qw[i]}px;
            height: ${qh[i]}px;
          `;
          youtuberContainer.style.cssText = `
            width: ${qw[i]}px;
            height: ${qh[i]}px;
            top: ${(wh - qh[i]) / 2}px;
            left: ${(ww - qw[i]) / 2}px;
          `;
          break;
        }
      }
    };

    youtuberItems.forEach(elem => {
      elem.addEventListener('click', () => {
        const idVideo = elem.dataset.youtuber;
        youtuberModal.style.display = 'block';

        const youtuberFrame = document.createElement('iframe');
        youtuberFrame.src = `https://youtube.com/embed/${idVideo}`;
        youtuberContainer.insertAdjacentElement('beforeend', youtuberFrame);

        window.addEventListener('resize', sizeVideo);

        sizeVideo();
      });
    });

    youtuberModal.addEventListener('click', () => {
      youtuberModal.style.display = '';
      youtuberContainer.textContent = '';
      window.removeEventListener('resize', sizeVideo);
    });
  };

  // модальное окно
  {
    document.body.insertAdjacentHTML(
      'beforeend',
      `
      <div class="youTuberModal">
        <div id="youtuberClose">&#215;</div>
        <div id="youtuberContainer"></div>
      </div>
      `
    );
    youtuber();
  }

  // API
  {
    const API_KEY = 'AIzaSyAiox8El-TwxRJ1gmrGVklUij-2v9xdMlo';
    const CLIENT_ID = '1013588345540-j6qbve8qk8nglh715lfavkrir8hja122.apps.googleusercontent.com';
    const CLIENT_SECRET = 'Mt2rUQkK9sGgY5Fgw_Vsrhei';

    // Authorize
    {
      const buttonAuth = document.getElementById('authorize');
      const authBlock = document.querySelector('.auth');
      const errorAuth = err => {
        console.error(err);
        authBlock.style.display = '';
      };

      gapi.load('client:auth2', () => gapi.auth2.init({ client_id: CLIENT_ID }));

      const authenticate = () =>
        gapi.auth2
          .getAuthInstance()
          .signIn({ scope: 'https://www.googleapis.com/auth/youtube.readonly' })
          .then(() => console.log('Авторизация успешна'))
          .catch(errorAuth);

      const loadClient = () => {
        gapi.client.setApiKey(API_KEY);
        return gapi.client
          .load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
          .then(() => console.log('GAPI client loaded for API'))
          .then(() => (authBlock.style.display = 'none'))
          .catch(errorAuth);
      };

      buttonAuth.addEventListener('click', () => {
        authenticate().then(loadClient);
      });
    }
  }

  // Request
  {
    const gloTube = document.querySelector('.logo-academy');
    const trends = document.getElementById('yt_trend');
    const like = document.getElementById('yt_like');
    const main = document.getElementById('yt_main');

    const request = options =>
      gapi.client.youtube[options.method]
        .list(options)
        .then(responce => responce.result.items)
        .then(render)
        .then(youtuber)
        .catch(err => console.error('Во время запроса произошла ошибка: ' + err));

    const render = data => {
      const ytWrapper = document.getElementById('yt-wrapper');
      ytWrapper.textContent = '';
      data.forEach(item => {
        try {
          const {
            id,
            id: { videoId },
            snippet: {
              channelTitle,
              title,
              thumbnails: {
                high: { url }
              },
              resourceId: { videoId: likedVideoId } = {}
            }
          } = item;
          console.log(videoId);
          ytWrapper.innerHTML += `
            <div class="yt" data-youtuber="${likedVideoId || videoId || id}">
              <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
              </div>
              <div class="yt-title">${title}</div>
              <div class="yt-channel">${channelTitle}</div>
            </div>
          `;
        } catch (e) {
          console.error(e);
        }
      });
    };

    gloTube.addEventListener('click', () => {
      request({
        method: 'search',
        part: 'snippet',
        channelId: 'UCVswRUcKC-M35RzgPRv8qUg',
        order: 'date',
        maxResults: 6
      });
    });

    trends.addEventListener('click', () => {
      request({
        method: 'videos',
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 6,
        region: 'RU'
      });
    });

    like.addEventListener('click', () => {
      request({
        method: 'playlistItems',
        part: 'snippet',
        playlistId: 'LLb9Y6ExpE4ptu5mJBvmLoJA',
        maxResults: 6
      });
    });

    main.addEventListener('click', () => {
      request({
        method: 'videos',
        part: 'snippet',
        myRating: 'dislike',
        order: 'date',
        maxResults: 6,
      });
    });
  }
});
