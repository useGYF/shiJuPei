<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%
   String path = request.getContextPath();
%>
<html>
    <head>
        <title>出错信息提示</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<script type=text/javascript src="<%=path %>/baseui/js/jquery-1.9.1.js"></script>
        <script language="javascript">
        	$(function() {
        		var bodyHeight = window.screen.height;
				var contentHeight = $('.msg').height();
				$('.msg').css({
					'margin-top' : (bodyHeight - contentHeight) / 2 - 100 + 'px'
				});
        		$('.custom-btn').hover(function(){
        			$(this).addClass('custom-btn-hover');
        		},function(){
        			$(this).removeClass('custom-btn-hover');
        		}).click(function(){
        			top.window.location="<%=path%>/common/login.jsp";
        		});
        		setTimeout(function(){
            		top.window.location="<%=path%>/common/login.jsp";
            	}, 5000);  
        	});
        </script>

        <style type="text/css"> 
        
        .msg{
            width:364px;
            height:214px;
			border: 1px solid #ccc;
			overflow: hidden;			 
			background-color: #fff;
			-webkit-border-radius: 2px 2px 2px 2px;
			-moz-border-radius: 2px 2px 2px 2px;
			border-radius: 2px 2px 2px 2px;
			margin: 0 auto;
        }
        .title{
        	background-color:#33a4ff;
        	height:34px;
        	line-height:34px;
        	font-weight:bold;
        	border-bottom:1px solid #33a4ff;
        	text-indent:10px;
        	color:#ffffff;
        	font-size:14px;
        	letter-spacing:2px;
        }
        
        .custom-btn {
			line-height: 24px;
			height: 24px;
			padding: 1px 5px 1px 5px;
			white-space: nowrap;
			cursor: pointer;
			color: #1f1f1f;
			background-color: #f6f6f6;
			border: 1px solid #ccc;
			-webkit-border-radius: 2px 2px 2px 2px;
			-moz-border-radius: 2px 2px 2px 2px;
			border-radius: 2px 2px 2px 2px;
			text-decoration: none;
			text-align: center;
			font-size:14px;
			width: 80px;
			margin:10px auto;
			letter-spacing:4px;
		}
		
		.custom-btn-hover {
			background-color: #33a4ff;
			border-color: #33a4ff;
			color: #ffffff;
			letter-spacing:4px;
		}
		.foot{
			border-top:1px solid #DCDCDC;
			height:50px;
        	line-height:50px;
        	text-align:center;
		}
		.content{
			height:100px;
			padding-top:30px; 
			padding-left:35px; 
			font-size:14px;
			letter-spacing:1px;
			line-height:28px;
		}
        </style>
    </head>

    <body>
        <div class="msg">
            <div class="title">
                消息
            </div>
            <div class="content">
                   对不起，您尚未登录或登录超时，点击确定<br/>将返回登录界面。
            </div>
            <div class="foot">
                <div class="custom-btn">确定</div>
            </div>
        </div>
    </body>
</html>