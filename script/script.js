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
    const typing = event => {
      const { target } = event;
      if (target.id == 'keyboard-backspace') {
        searchInput.value = searchInput.value.substring(
          0,
          searchInput.value.length - 1
        );
      } else {
        if (target.tagName === 'BUTTON') {
          searchInput.value += target.textContent
            ? target.textContent.trim()
            : ' ';
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

  // модальное окно
  {
    const divYoutuber = document.createElement('div');
  }
});
