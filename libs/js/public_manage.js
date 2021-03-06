(function($, Api, _W) {
	_W.index = (function() {
		var _v = {
				public: {},
				businesskind: [{
					id: "100000000",
					name: "旅馆业"
				}, {
					id: "100000010",
					name: "网吧"
				}, {
					id: "100000013",
					name: "酒吧"
				}, {
					id: "100000001",
					name: "KTV"
				}, {
					id: "100000003",
					name: "影剧院"
				}, {
					id: "100000002",
					name: "废旧物品回收"
				}, {
					id: "100000011",
					name: "餐饮业"
				}, {
					id: "100000006",
					name: "金银首饰加工"
				}, {
					id: "100000004",
					name: "商（市）场"
				}, {
					id: "100000005",
					name: "汽车修理业"
				}, {
					id: "100000008",
					name: "典当业"
				}, {
					id: "100000014",
					name: "养老机构"
				}, {
					id: "100000015",
					name: "幼儿园"
				}, {
					id: "100000016",
					name: "中小学"
				}, {
					id: "100000009",
					name: "手机回收修理"
				}, {
					id: "100000007",
					name: "开锁"
				}, {
					id: "100000020",
					name: "刻字刻章"
				}, {
					id: "100000021",
					name: "其他"
				}, {
					id: "100000018",
					name: "物流寄递业"
				}, {
					id: "100000012",
					name: "企事业单位"
				}, {
					id: "100000017",
					name: "大学"
				}],
				businesskindResule: {
					name: '',
					id: '',
				},
				position: {},
				addressStr: '',
				publicId: '',
				firstInitPage: false,
				police: {
					list: [
						[],
						[]
					],
					result: [{
						name: ' - 请选择 - ',
						id: '0',
						teamid: '0',
						index: '0',
					}, {
						name: ' - 请选择 - ',
						id: '0',
						teamid: '0',
						index: '0',
					}],
					data: [],
				},
				searchValue: {
					str: '',
					index: 1,
					count: 10,
					allPages: null,
				},
			},
			_f = {
				init: function() {
					_v.public = permissions.getUserMessage().publicMessage;
					_a.getManageDetail(_v.public.id, function(result) {
						console.log(result);
						_v.public.ds_latitude = result.ds_latitude;
						_v.public.ds_longitude = result.ds_longitude;
						_v.public.systemuserName = result['ds_charger-ds_name'];
						_v.public.systemuserid = result['ds_charger-systemuserid'];
						_v.public.ds_businesskind = result.ds_businesskind ? result.ds_businesskind.split(':')[0] : null;
						_v.public.ds_address_tree_name = result['ds_address_tree-ds_name'];
						_v.public.ds_address_tree = result['ds_address_tree-ds_address_l4id'];
						_v.publicId = _v.public.id;
						if (_v.public.ds_latitude && _v.public.ds_longitude) {
							var addressName = '经度 : ' + _v.public.ds_latitude + ' <br> ' + '纬度 : ' + _v.public.ds_longitude;
						} else {
							var addressName = '未录入';
						};
						$('#setAddressName').html(addressName);
						var policeName = _v.public.systemuserName || '未录入';
						$('#setPoliceName').text(policeName);
						var addressTreeName = _v.public.ds_address_tree_name || '未录入';
						$('#setAddressTreeName').text(addressTreeName);
						if (_v.public.ds_businesskind) {
							var businesskind = '未录入';
							for (var i = 0; i < _v.businesskind.length; i++) {
								if (_v.public.ds_businesskind == _v.businesskind[i].id) {
									var businesskind = _v.businesskind[i].name;
									$('#setBusinesskindName').text(businesskind);
									break;
								};
							}
						} else {
							var businesskind = '未录入';
							$('#setBusinesskindName').text(businesskind);
						};
						if (_v.public.systemuserid && _v.public.teamid && _v.public.ds_businesskind && _v.public.ds_latitude && _v.public.ds_longitude && _v.public.ds_address_tree) {
							$('#backButton').css('display', 'block');
						} else {
							$('#backButton').css('display', 'none');
							if (!_v.firstInitPage) {
								_v.firstInitPage = true;
								Api.alert({
									className: 'confirmPopup',
									text: '请完善行业场所信息'
								});
							};
						};
						$('#setAddress').unbind().bind('click', _f.initMap);
						$('#setPolice').unbind().bind('click', _f.initPolice);
						$('#setAddressTree').unbind().bind('click', _f.initAddress);
						$('#setBusinesskind').unbind().bind('click', _f.initBusinesskind);
					}, function() {
						Api.alert({
							text: '获取信息失败,请刷新页面重试',
						})
					});
				},
				initMap: function() {
					var imageTemplate = _t.chooseMap()
					$('body').append(imageTemplate);
					var marker, map = new AMap.Map("amap", {
						resizeEnable: false,
						center: [125.664676, 43.525465],
						zoom: 14,
					});
					map.plugin('AMap.Geolocation', function() {
						geolocation = new AMap.Geolocation({
							enableHighAccuracy: true, //是否使用高精度定位，默认:true
							timeout: 10000, //超过10秒后停止定位，默认：无穷大
							buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
							zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
							buttonPosition: 'RB'
						});
						map.addControl(geolocation);
						geolocation.getCurrentPosition();
						AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
						AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
					});
					//解析定位结果
					function onComplete(data) {
						_v.position.latitude = data.position.getLat().toString();
						_v.position.longitude = data.position.getLng().toString();
						imageTemplate.find('.chooseAddressResults .name').html('当前位置 : <br>经度 : ' + _v.position.latitude + ' ; ' + '纬度 : ' + _v.position.longitude);
						// imageTemplate.find('.chooseAddressResults textarea').val(data.formattedAddress);
						if (marker) {
							map.remove(marker);
						};
					};
					//解析定位错误信息
					function onError(data) {
						Api.alert({
							text: '自动定位失效,请刷新页面或手动定位'
						});
					};
					AMap.plugin('AMap.Geocoder', function() {
						var geocoder = new AMap.Geocoder({
							city: "010"
						});
						map.on('click', function(e) {
							if (marker) {
								marker.setMap(null);
								marker = null;
							};
							marker = new AMap.Marker({
								icon: "/publicorder_web/libs/img/mark.png",
								position: [e.lnglat.getLng(), e.lnglat.getLat()]
							});
							marker.setMap(map);
							_v.position.latitude = e.lnglat.getLat().toString();
							_v.position.longitude = e.lnglat.getLng().toString();
							geocoder.getAddress(e.lnglat, function(status, result) {
								if (status == 'complete') {
									_v.addressStr = result.regeocode.formattedAddress;
									imageTemplate.find('.chooseAddressResults .name').html('您选择的位置 : <br>经度 : ' + _v.position.latitude + ' ; ' + '纬度 : ' + _v.position.longitude);
									// imageTemplate.find('.chooseAddressResults textarea').val(_v.addressStr);
								}
							});
						});
					});
				},
				getPosition: function() {
					if (!_v.position.latitude || !_v.position.longitude) {
						Api.alert({
							text: '请手动选择位置'
						});
					};
					Api.confirm({
						className: 'confirmPopup',
						title: '提示',
						text: '是否确认选择该地点?',
						confirm: {
							text: '确定',
							event: function() {
								_a.updatePublicPosition(function() {
									$('#addPublicPosition').remove();
									var public = {}
									public.publicMessage = _v.public
									public.publicMessage.ds_latitude = _v.position.latitude;
									public.publicMessage.ds_longitude = _v.position.longitude;
									// public.publicMessage.ds_address = _v.addressStr;
									Api.storage.set('publicorder_wap', public);
									_v.position = {};
									_v.addressStr = '';
									_f.init();
								});
							},
						},
						cancel: {
							text: '取消',
							event: false,
						}
					});
				},
				initAddress: function() {
					$('body').append(_t.chooseAddress());
				},
				getAddress: function(data) {
					Api.confirm({
						className: 'confirmPopup',
						title: '提示',
						text: '是否选择' + data.ds_name + '?',
						confirm: {
							text: '确定',
							event: function() {
								_a.updatePublicAddress(data.ds_address_l4id, function() {
									$('#addPublicAddress').remove();
									var public = {}
									public.publicMessage = _v.public
									public.publicMessage.ds_address_tree_name = data.ds_name;
									public.publicMessage.ds_address_tree = data.ds_address_l4id;
									Api.storage.set('publicorder_wap', public);
									_f.init();
								});
							},
						},
						cancel: {
							text: '取消',
						}
					});
				},
				initBusinesskind: function() {
					$('body').append(_t.chooseBusinesskind());
				},
				getBusinesskind: function() {
					if (_v.businesskindResule.id == 0) {
						Api.alert({
							className: 'confirmPopup',
							text: '请选择有效的场所类型',
						});
						return;
					};
					Api.confirm({
						className: 'confirmPopup',
						title: '提示',
						text: '是否选择' + _v.businesskindResule.name + '?',
						confirm: {
							text: '确定',
							event: function() {
								_a.updateBusinesskind(function() {
									$('#addBusinesskind').remove();
									var public = {};
									public.publicMessage = _v.public;
									public.publicMessage.ds_businesskind = _v.businesskindResule.id;
									Api.storage.set('publicorder_wap', public);
									_v.businesskindResule = {
										name: '',
										id: '',
									};
									_f.init();
								});
							},
						},
						cancel: {
							text: '取消',
							event: function() {
								$('.tree1').empty();
								var businesskind = jQuery.extend(true, [], _v.businesskind);
								$('.tree1').append(_t.optionTemplate({
									name: ' - 请选择 - ',
									id: 0,
								}));
								for (var i = 0; i < businesskind.length; i++) {
									var options = businesskind[i];
									$('.tree1').append(_t.optionTemplate(options));
								};
							},
						}
					});
				},
				initPolice: function() {
					_a.getPolice(function() {
						$('body').append(_t.choosePolice());
					});
				},
				formattedPolice: function(data, toData) {
					for (var i = 0; i < data.length; i++) {
						var _data = {};
						_data.name = data[i].name;
						_data.id = data[i].id;
						_data.index = i;
						toData.push(_data);
					};
				},
				formattingAddress: function(data, toData) {
					for (var i = 0; i < data.length; i++) {
						var _data = {};
						_data.name = data[i].name;
						_data.id = data[i].id;
						_data.index = i;
						toData.push(_data);
					};
				},
				formattedPoliceResult: function(data) {
					_v.police = {
						list: [
							[],
							[]
						],
						result: [{
							name: ' - 请选择 - ',
							id: '0',
							teamid: '0',
							index: '0',
						}, {
							name: ' - 请选择 - ',
							id: '0',
							teamid: '0',
							index: '0',
						}],
						data: [],
					};
					var police = [];
					for (var i = 0; i < data.length; i++) {
						if (police.length == 0) {
							police.push({
								name: data[i].teamName,
								id: data[i].teamId,
								list: [],
							})
						} else {
							var isChecked = false;
							for (var d = 0; d < police.length; d++) {
								if (police[d].name == data[i].teamName) {
									isChecked = true;
								};
							};
							if (!isChecked) {
								police.push({
									name: data[i].teamName,
									id: data[i].teamId,
									list: [],
								})
							}
						}
					};
					for (var i = 0; i < data.length; i++) {
						for (var d = 0; d < police.length; d++) {
							if (data[i].teamName == police[d].name) {
								police[d].list.push({
									name: data[i].name,
									id: data[i].policeCrmId
								});
							}
						}
					};
					_v.police.data = police;
					_f.formattingAddress(_v.police.data, _v.police.list[0]);
				},
				getPolice: function() {
					if (_v.police.result[1].id == 0) {
						Api.alert({
							className: 'confirmPopup',
							text: '请选择有效民警',
						});
						return;
					};
					Api.confirm({
						className: 'confirmPopup',
						title: '提示',
						text: '是否选择' + _v.police.result[1].name + '?',
						confirm: {
							text: '确定',
							event: function() {
								_a.updatePublicPolice(function() {
									$('#addPolice').remove();
									var public = {}
									public.publicMessage = _v.public;
									public.publicMessage.teamName = _v.police.result[0].name;
									public.publicMessage.teamid = _v.police.result[0].id;
									public.publicMessage.systemuserName = _v.police.result[1].name;
									public.publicMessage.systemuserid = _v.police.result[1].id;
									Api.storage.set('publicorder_wap', public);
									_v.police = {
										list: [
											[],
											[]
										],
										result: [{
											name: ' - 请选择 - ',
											id: '0',
											teamid: '0',
											index: '0',
										}, {
											name: ' - 请选择 - ',
											id: '0',
											teamid: '0',
											index: '0',
										}],
										data: [],
									};
									_f.init();
								});
							},
						},
						cancel: {
							text: '取消',
							event: function() {
								$('.tree2').empty();
								var Tree2 = jQuery.extend(true, [], _v.police.list[1]);
								$('.tree2').append(_t.optionTemplate({
									name: ' - 请选择 - ',
									id: 0,
								}));
								for (var i = 0; i < Tree2.length; i++) {
									var options = Tree2[i];
									$('.tree2').append(_t.optionTemplate(options));
								};
							},
						}
					});
				},
			},
			_a = {
				updatePublicPosition: function(success) {
					Api.PUT({
						url: "/crm/Entities('ds_publicorder" + _v.publicId + "')",
						data: {
							attributes: [{
								"name": "ds_latitude",
								"value": _v.position.latitude,
							}, {
								"name": "ds_longitude",
								"value": _v.position.longitude,
							}]
						},
						success: function(result) {
							success();
						}
					})
				},
				updatePublicAddress: function(id, success) {
					Api.PUT({
						url: "/crm/Entities('ds_publicorder" + _v.publicId + "')",
						data: {
							attributes: [{
								"name": "ds_address_tree",
								"value": "@look/" + id
							}]
						},
						success: function(result) {
							success();
						}
					})
				},
				updatePublicPolice: function(success) {
					Api.PUT({
						url: "/crm/Entities('ds_publicorder" + _v.publicId + "')",
						data: {
							attributes: [{
								"name": "ds_districtpolicestation_name",
								"value": "@look/" + _v.police.result[0].id
							}, {
								"name": "ds_charger",
								"value": "@look/" + _v.police.result[1].id
							}]
						},
						success: function(result) {
							success();
						}
					})
				},
				updateBusinesskind: function(success) {
					Api.PUT({
						url: "/crm/Entities('ds_publicorder" + _v.publicId + "')",
						data: {
							attributes: [{
								"name": "ds_businesskind",
								"value": "@code/" + _v.businesskindResule.id
							}]
						},
						success: function(result) {
							success();
						}
					})
				},
				getPolice: function(success) {
					Api.POST({
						url: "/api/Crm/GetAllPolice",
						success: function(result) {
							if (result.status == 0) {
								_f.formattedPoliceResult(result.resultObj);
								success();
							} else {
								_C.alert({
									className: 'confirmPopup',
									text: result.message
								});
							};
							
						}
					});
				},
				searchAddressTree: function(data, success) {
					Api.POST({
						url: '/api/Crm/SearchAddress',
						data: {
							"commonStr": data.str,
							"index": data.index,
							"count": data.count
						},
						success: function(result) {
							if (result.status == 0) {
								var value = result.resultObj
								if (index == 1 && value.length == 0) {
									_v.searchValue.allPages = 1;
									success(value);
								} else if (index != 1 && value.length == 0) {
									_v.searchValue.index -= 1;
									_a.searchAddressTree(_v.searchValue, _e.searchButtonEvent);
								} else {
									_v.searchValue.allPages = Math.ceil(result.resultObj[0].totalCount / _v.searchValue.count);
									success(value);
								};
							} else if (result.status == 2) {
								Api.alert({
									text: '未搜索到结果'
								});
								_v.searchValue.allPages = 1;
								success([]);
							} else {
								Api.alert({
									text: '数据错误,请重试'
								})
							}
						}
					});
				},
				getManageDetail: function(id, success) {
					Api.GET({
						url: "/crm/Entities?$expand=attributes(" +
							"$filter= name eq 'ds_businesskind'" +
							"or name eq 'ds_districtpolicestation_name'" +
							"or name eq 'ds_latitude'" +
							"or name eq 'ds_longitude'" +
							"or name eq 'ds_address_tree-ds_address_l4id'" +
							"or name eq 'ds_address_tree-ds_name'" +
							"or name eq 'ds_charger-systemuserid'" +
							"or name eq 'ds_charger-ds_name'" +
							"),lookups&$filter=name eq 'ds_publicorder' and query eq 'ds_publicorderid eq " + id + "'",
						success: function(result) {
							var value = Api.formatting.CRMValue(result.value);
							success(value);
						}
					});
				},
			},
			_t = {
				chooseMap: function() {
					var html = '';
					html += '<div class="mapBg" id="addPublicPosition">';
					html += '	<div id="header" class="com-bg">';
					html += '		<div class="left-button white-color">';
					html += '			<a>';
					html += '				<img src="/publicorder_wap/libs/img/icon-left.png" alt="" style="width: 77%; margin: 9px 10px;">';
					html += '			</a>';
					html += '		</div>';
					html += '		<div class="right-button white-color">确定</div>';
					html += '		<div class="title white-color fs-big">选择场所位置</div>';
					html += '	</div>';
					html += '	<div class="chooseAddressResults">';
					html += '		<div class="name">当前位置 : </div>';
					// html += '		<textarea style="resize: none; width:100%; height: 80px;"></textarea>';
					html += '	</div>';
					html += '	<div class="amap" id="amap" style="top:110px"></div>';
					html += '</div>';
					html = $(html);
					html.find('.left-button').click(function() {
						html.remove();
					});
					html.find('.right-button').click(_f.getPosition);
					return html;
				},
				optionTemplate: function(data) {
					var html = "";
					html += '<option value="' + data.id + '" data-index="' + data.index + '" ' + (data.isSelect ? 'select="select"' : '') + '>' + data.name + '</option>';
					return html;
				},
				chooseAddress: function() {
					var html = "";
					html += '<div class="mapBg" id="addPublicAddress" style="background:#fff;">';
					html += '	<div id="header" class="com-bg">';
					html += '		<div class="left-button white-color">';
					html += '			<a>';
					html += '				<img src="/publicorder_wap/libs/img/icon-left.png" alt="" style="width: 77%; margin: 9px 10px;">';
					html += '			</a>';
					html += '		</div>';
					html += '		<div class="title white-color fs-big">选择行政区域</div>';
					html += '		<div class="right-button white-color">搜索</div>';
					html += '	</div>';
					html += '	<div class="searchAddressTree">';
					html += '		<input type="text" placeholder="请输入关键字" />';
					html += '		<div class="searchlist" id="searchlist"></div>';
					html += '		<div id="searchAddressTreeFooter"></div>';
					html += '	</div>';
					html += '</div>';
					html = $(html);
					html.find('.left-button').click(function() {
						html.remove();
					});
					html.find('.right-button').click(function() {
						var text = html.find('.searchAddressTree input').val();
						if (text.length < 2) {
							Api.alert({
								text: '关键字太短'
							});
							return;
						};
						_v.searchValue.str = text;
						_v.searchValue.index = 1;
						_a.searchAddressTree(_v.searchValue, _e.searchButtonEvent);
					});
					return html;
				},
				chooseAddressItem: function(data) {
					var html = '<div class="listItem">' + data.ds_name + '</div>';
					html = $(html);
					html.click(function() {
						_f.getAddress(data);
					});
					return html;
				},
				choosePolice: function() {
					var html = '';
					html += '<div class="mapBg" id="addPolice" style="background:#fff;">';
					html += '	<div id="header" class="com-bg">';
					html += '		<div class="left-button white-color">';
					html += '			<a>';
					html += '				<img src="/publicorder_wap/libs/img/icon-left.png" alt="" style="width: 77%; margin: 9px 10px;">';
					html += '			</a>';
					html += '		</div>';
					html += '		<div class="title white-color fs-big">选择所属民警</div>';
					html += '	</div>';
					html += '	<select class="tree1" style="margin-top: 100px;"></select>';
					html += '	<select class="tree2" style="display:none"></select>';
					html += '</div>';
					html = $(html);
					html.find('.left-button').click(function() {
						html.remove();
					});
					var police = {};
					police.Tree1 = jQuery.extend(true, [], _v.police.list[0]);
					html.find('.tree1').append(_t.optionTemplate({
						name: ' - 请选择 - ',
						id: 0,
					}));
					for (var i = 0; i < police.Tree1.length; i++) {
						var options = police.Tree1[i];
						html.find('.tree1').append(_t.optionTemplate(options));
					};
					html.find('.tree1').change(function() {
						_v.police.result[0].id = $(this).val();
						_v.police.result[0].name = $(this).find("option:selected").text();
						_v.police.result[0].index = $(this).find("option:selected").attr('data-index');
						html.find('.tree2').empty().css('display', 'none');
						_v.police.result[1] = {
							name: ' - 请选择 - ',
							id: '0',
							index: '0',
						};
						if (_v.police.result[0].id == 0) {
							return;
						}
						_v.police.list[1] = [];
						_f.formattingAddress(_v.police.data[_v.police.result[0].index].list, _v.police.list[1]);
						police.Tree2 = [];
						police.Tree2 = jQuery.extend(true, [], _v.police.list[1]);
						html.find('.tree2').append(_t.optionTemplate({
							name: ' - 请选择 - ',
							id: 0,
						}));
						for (var i = 0; i < police.Tree2.length; i++) {
							var options = police.Tree2[i];
							html.find('.tree2').append(_t.optionTemplate(options));
						};
						html.find('.tree2').css('display', 'block');
					});
					html.find('.tree2').change(function() {
						_v.police.result[1].id = $(this).val();
						_v.police.result[1].name = $(this).find("option:selected").text();
						_f.getPolice();
					});
					return html;
				},
				chooseBusinesskind: function() {
					var html = '';
					html += '<div class="mapBg" id="addBusinesskind" style="background:#fff;">';
					html += '	<div id="header" class="com-bg">';
					html += '		<div class="left-button white-color">';
					html += '			<a>';
					html += '				<img src="/publicorder_wap/libs/img/icon-left.png" alt="" style="width: 77%; margin: 9px 10px;">';
					html += '			</a>';
					html += '		</div>';
					html += '		<div class="title white-color fs-big">选择场所类型</div>';
					html += '	</div>';
					html += '	<select class="tree1" style="margin-top: 100px;"></select>';
					html += '</div>';
					html = $(html);
					html.find('.left-button').click(function() {
						html.remove();
					});
					businesskind = jQuery.extend(true, [], _v.businesskind);
					html.find('.tree1').append(_t.optionTemplate({
						name: ' - 请选择 - ',
						id: 0,
					}));
					for (var i = 0; i < businesskind.length; i++) {
						var options = businesskind[i];
						html.find('.tree1').append(_t.optionTemplate(options));
					};
					html.find('.tree1').change(function() {
						_v.businesskindResule.id = $(this).val();
						_v.businesskindResule.name = $(this).find("option:selected").text();
						_f.getBusinesskind();
					});
					return html;
				},
				pageing: function() {
					var html = '';
					html += '<div id="PageButton" class="cl">';
					html += '	<div class="prev">上一页</div>';
					html += '	<div class="text">当前第<span><select style="width:auto; height:auto; line-height:20px;"></select></span>页</div>';
					html += '	<div class="next">下一页</div>';
					html += '</div>';
					html = $(html);

					for (var i = 0; i < parseInt(_v.searchValue.allPages); i++) {
						html.find('select').append(_t.pageOption(i + 1));
					};
					html.find('select').change(function() {
						_v.searchValue.index = $(this).find('option:selected').val();
						_a.searchAddressTree(_v.searchValue, _e.searchButtonEvent);
					});

					html.find('.prev').click(function() {
						if (_v.searchValue.index > 1) {
							_v.searchValue.index--;
							_a.searchAddressTree(_v.searchValue, _e.searchButtonEvent);
						};
					});
					html.find('.next').click(function() {
						if (_v.searchValue.index < _v.searchValue.allPages) {
							_v.searchValue.index++;
							_a.searchAddressTree(_v.searchValue, _e.searchButtonEvent);
						};
					});
					return html;
				},
				pageOption: function(data) {
					var html = '';
					html += '<option value="' + data + '" ' + (data == _v.searchValue.index ? 'selected="selected"' : '') + '>' + data + '</option>';
					return html;
				},
				initCounts: function() {
					$('#PageButton').remove();
					if (_v.searchValue.allPages == 1) {
						$('#searchlist').css('bottom', '0px');
						return;
					} else {
						$('#searchAddressTreeFooter').append(_t.pageing());
					}
				},
			},
			_e = {
				searchButtonEvent: function(result) {
					$('#addPublicAddress').find('.searchAddressTree .searchlist').empty();
					for (var i = 0; i < result.length; i++) {
						$('#addPublicAddress').find('.searchAddressTree .searchlist').append(_t.chooseAddressItem(result[i]));
					};
					_t.initCounts();
					$('#searchlist').css('bottom', '0px');
				},
			}
		return {
			init: _f.init,
		};
	})();
})(jQuery, common, window);
$(document).ready(function() {
	index.init();
});