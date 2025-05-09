(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // TODO; 
  window.loadMod = function(url) {
  };

// Initialize the global tracker once
window.renderedNewsHeadlines = window.renderedNewsHeadlines || new Set();

window.addNewsItem = function(headline, subtext) {
    const feed = document.getElementById('news_feed');
    if (!feed) return;

    // Initialize the tracker if needed
    if (!window.renderedNewsHeadlines) {
        window.renderedNewsHeadlines = new Set();
    }

    // Prevent duplicates in DOM
    const exists = feed.querySelector(`.news-item[data-headline="${headline}"]`);
    if (exists) return;

    const isNew = !window.renderedNewsHeadlines.has(headline);

    // Only shift existing items if this is a new headline
    if (isNew) {
        const existingItems = feed.querySelectorAll('.news-item');
        existingItems.forEach(item => item.classList.add('shifted'));

        setTimeout(() => {
            existingItems.forEach(item => item.classList.remove('shifted'));
        }, 300); // Match CSS transition time
    }

    // Create new news item
    const itemContainer = document.createElement('div');
    itemContainer.className = 'news-item';
    itemContainer.dataset.headline = headline;

    const headlineEl = document.createElement('div');
    headlineEl.className = 'news-headline';
    headlineEl.textContent = headline;

    const subtextEl = document.createElement('div');
    subtextEl.className = 'news-subtext';
    subtextEl.textContent = subtext;

    itemContainer.appendChild(headlineEl);
    itemContainer.appendChild(subtextEl);
    feed.insertBefore(itemContainer, feed.firstChild);

    // Apply fade-in if truly new
    if (isNew) {
        itemContainer.classList.add('new-item');
        itemContainer.addEventListener('animationend', () => {
            itemContainer.classList.remove('new-item');
            itemContainer.style.opacity = '1';
        });
        window.renderedNewsHeadlines.add(headline);
    } else {
        itemContainer.style.opacity = '1';
    }

    // Update the news_items array if needed
    if (!dendryUI.dendryEngine.state.qualities.news_items) {
        dendryUI.dendryEngine.state.qualities.news_items = [];
    }

    const itemExists = dendryUI.dendryEngine.state.qualities.news_items.some(
        item => item.headline === headline && item.subtext === subtext
    );
    if (!itemExists) {
        dendryUI.dendryEngine.state.qualities.news_items.push({ headline, subtext });
    }
};

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };


  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
  };

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.updateNewsSidebar = function() {
     $('#news_feed').empty();
     var scene = dendryUI.game.scenes[window.newsTab];
     dendryUI.dendryEngine._runActions(scene.onArrival);
     var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
     $('#news_feed').append(dendryUI.contentToHTML.convert(displayContent));
   };

   window.changeNewsTab = function(newTab, tabId) {
     var tabButton = document.getElementById(tabId);
     var tabButtons = document.getElementsByClassName('news_tab_button');
     for (var i = 0; i < tabButtons.length; i++) {
       tabButtons[i].className = tabButtons[i].className.replace(' active', '');
     }
     tabButton.className += ' active';
     window.newsTab = newTab;
     window.updateNewsSidebar();
    };



  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.newsTab = "news";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings();
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

}());
