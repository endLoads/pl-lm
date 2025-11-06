(function() {
	'use strict';

         Lampa.Platform.tv();

Lampa.Storage.listener.follow('change', function(e) {});

Lampa.Settings.listener.follow('open', function(e) {
	if (e.name == 'interface') {
		Lampa.Settings.create('back_menu');
		setTimeout(function() {
			$('[data-component="back_menu"]').trigger('hover:enter');
		}, 0);
	}
});

Lampa.Settings.addComponent({
	component: 'back_menu',
	param: {
		name: 'back_menu',
		type: 'trigger',
		default: false
	},
	field: {
		name: 'Меню Выход',
		description: 'Настройки отображения пунктов меню'
	},
	onRender: function(item) {
		item.on('hover:enter', function() {
			Lampa.Settings.create('back_menu');
			Lampa.Controller.toggle('content').listener.back = function() {
				Lampa.Settings.toggle('back_menu');
			};
		});
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'exit',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '2'
	},
	field: {
		name: 'Закрыть приложение',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'reboot',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '2'
	},
	field: {
		name: 'Перезагрузить',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'switch_server',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '2'
	},
	field: {
		name: 'Сменить сервер',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'clear_cache',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '2'
	},
	field: {
		name: 'Очистить кэш',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'youtube',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '1'
	},
	field: {
		name: 'YouTube',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'rutube',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '1'
	},
	field: {
		name: 'RuTube',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'drm_play',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '1'
	},
	field: {
		name: 'DRM Play',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'twitch',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '1'
	},
	field: {
		name: 'Twitch',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'fork_player',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '1'
	},
	field: {
		name: 'ForkPlayer',
		description: 'Нажмите для выбора'
	}
});

Lampa.Settings.addParam({
	component: 'back_menu',
	param: {
		name: 'speedtest',
		type: 'select',
		values: {1: 'Скрыть', 2: 'Отобразить'},
		default: '1'
	},
	field: {
		name: 'Speed Test',
		description: 'Нажмите для выбора'
	}
});

function speedTestModal() {
	var html = $('<div style="text-align:right;"><div style="min-height:360px;"><iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe></div></div>');
	Lampa.Modal.open({
		title: '',
		html: html,
		size: 'medium',
		mask: true,
		onBack: function() {
			Lampa.Modal.close();
			Lampa.Controller.toggle('content');
		},
		onSelect: function() {}
	});
	var iframe = document.getElementById('speedtest-iframe');
	iframe.src = 'http://speedtest.vokino.tv/?R=3';
}

function clearCache() {
	Lampa.Storage.clear();
}

var protocol = location.protocol === 'https:' ? 'https://' : 'http://';

function inputServer() {
	Lampa.Input.edit({
		title: 'Укажите cервер',
		value: '',
		free: true
	}, function(new_value) {
		if (new_value !== '') {
			window.location.href = protocol + new_value;
		} else {
			showExitMenu();
		}
	});
}

function exitApp() {
	if (Lampa.Platform.is('android')) window.location.assign('exit://exit');
	if (Lampa.Platform.is('tizen')) tizen.application.getCurrentApplication().exit();
	if (Lampa.Platform.is('webos')) window.close();
	if (Lampa.Platform.is('orsay')) Lampa.Orsay.exit();
	if (Lampa.Platform.is('netcast')) window.NetCastBack();
	if (Lampa.Platform.is('browser')) window.history.back();
	if (Lampa.Platform.is('apple_tv')) window.close();
	if (Lampa.Platform.is('nw')) nw.Window.get().close();
}

function showExitMenu() {
	var controller_name = Lampa.Controller.toggle('content').name;
	var items = [];
	if (localStorage.getItem('exit') !== '1') items.push({title: 'Закрыть приложение'});
	if (localStorage.getItem('reboot') !== '1') items.push({title: 'Перезагрузить'});
	if (localStorage.getItem('switch_server') !== '1') items.push({title: 'Сменить сервер'});
	if (localStorage.getItem('clear_cache') !== '1') items.push({title: 'Очистить кэш'});
	if (localStorage.getItem('youtube') !== '1') items.push({title: 'YouTube'});
	if (localStorage.getItem('rutube') !== '1') items.push({title: 'RuTube'});
	if (localStorage.getItem('drm_play') !== '1') items.push({title: 'DRM Play'});
	if (localStorage.getItem('twitch') !== '1') items.push({title: 'Twitch'});
	if (localStorage.getItem('fork_player') !== '1') items.push({title: 'ForkPlayer'});
	if (localStorage.getItem('speedtest') !== '1') items.push({title: 'Speed Test'});

	Lampa.Select.show({
		title: 'Выход ',
		items: items,
		onBack: function() {
			Lampa.Controller.toggle('content');
		},
		onSelect: function(item) {
			if (item.title == 'Закрыть приложение') exitApp();
			if (item.title == 'Перезагрузить') location.reload();
			if (item.title == 'Сменить сервер') inputServer();
			if (item.title == 'Очистить кэш') clearCache();
			if (item.title == 'YouTube') window.location.href = 'https://youtube.com/tv';
			if (item.title == 'RuTube') window.location.href = 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/';
			if (item.title == 'DRM Play') window.location.href = 'https://ott.drm-play.com';
			if (item.title == 'Twitch') window.location.href = 'https://webos.tv.twitch.tv';
			if (item.title == 'ForkPlayer') window.location.href = 'http://browser.appfxml.com';
			if (item.title == 'Speed Test') speedTestModal();
		}
	});
}

Lampa.Controller.listener.follow('toggle', function(e) {
	if (e.name == 'select' && $('.selectbox__title').text() == Lampa.Lang.translate('title_out')) {
		Lampa.Select.hide();
		setTimeout(function() {
			showExitMenu();
		}, 10);
	}
});
