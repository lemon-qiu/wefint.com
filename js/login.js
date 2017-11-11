/**
 * @Created with fly.
 * @User: z1163764648.com
 * @Date: 2017/11/6
 * @Time: 16:50
 */

let code;

/**
 * 创建生成随机 验证码
 */
function createCode() {
    code = '';
    let E = 4;
    let A = document.getElementById('code');
    let C = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y','Z'];
    for (let B = 0; B < E; B++) {
        let D = Math.floor(Math.random() * 36);
        code += C[D]
    }
    document.getElementById('code').value = code
}

/**
 * 验证输入的验证码是否正确
 * @returns {boolean}
 */
function validate() {
    let A = document.getElementById('checkcode').value.toUpperCase();
    if (A.length <= 0) {
        return false
    } else {
        if (A != code) {
            alert('验证码错误!');
            createCode();
            document.getElementById('checkcode').value = '';
            return false
        }
    }
    return true
}

/**
 *  验证登录方法 首先先验证账号密码是否正确 在根据token请求数据
 * @param E 传入登录需要的对象
 * @returns {boolean}
 */
function memberLogin(E) {
    let D = new Base64();
    let C = E.userName;
    let B = E.password;
    let A = {
        'username': C,
        'password': B,
    };
    $.ajax({
        type: 'POST',
        url: getUrl(1) + '/sso/login',
        data: A,
        error: function(F) {
            alert('系统错误，请刷新浏览器。')
        },
        success: function(DATA) {
            if(DATA.code === USERDOESNOTEXIST || DATA.code === WRONGPASSWORD){
                alert('用户名或者密码不正确！');
                return false
            }else if(DATA.code === INVALIDLOGIN){
                alert('无效登录！');
                return false
            }else if(DATA.code === SUCCESSFULUSERLOGIN){
                setCookie('token',DATA.content, 7);
                let ID = {id : DATA.content};
                	$.ajax({
                		url : getUrl(1) + '/sso/find',
                		type : 'post', // IE必须加上post
                		dataType : 'json',
                		timeout : 1000 * 60,
                		async : true,// 同步执行
                		data : ID,
                		success : function(result) {
                            if(result.code === SUCCESSFULUSERLOGIN){
                                setCookie('userName',result.content.userName, 7);
                                if(result.content.loginRoleLevel === '1'){   // 销售·1
                                    setCookie('loginRoleLevel',result.content.loginRoleLevel);
                                    window.location.href = './salesList.html';
                                }else if(result.content.loginRoleLevel === '2'){  // 风控
                                    setCookie('loginRoleLevel',result.content.loginRoleLevel);
                                    window.location.href = './riskControlList.html';
                                }else if(result.content.loginRoleLevel === '3'){  // 投资方
                                    setCookie('loginRoleLevel',result.content.loginRoleLevel);
                                    window.location.href = './checkAudit.html';
                                }else{
                                    window.location.href = './mainPannel.html';
                                }
                            }else{
                                alert('系统错误，请重试')
                            }
                		},
                		error : function(request, status, e) {
                			alert('系统错误');
                		}
                	});
            }
        }
    });
    return false
};