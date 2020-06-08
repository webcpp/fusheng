#!/bin/bash

DIR=/usr/local/fusheng/
PID=`pidof fusheng`
PIDFILE="./fusheng.pid"

cd $DIR

fusheng_start(){
	if [ -z "$PID"  ];then
		echo "starting fusheng..."
		./fusheng
		echo "fusheng is running!"
	else
		echo "fusheng is running."
	fi
}

fusheng_stop(){
	if [ -z "$PID" ];then
		echo "fusheng is stoped!"
	else
		if [ -f $PIDFILE ];then
			echo "stopping fusheng..."
			kill -2 `cat $PIDFILE`
			echo "fusheng is stoped!"
			rm -f $PIDFILE
		fi
	fi
}

fusheng_reload(){
	if [ -f $PIDFILE ];then
		echo "reloading fusheng..."
		kill -1 `cat $PIDFILE`
		echo "fusheng is reloaded!"
	else
		echo "fusheng is not running."
	fi
}

fusheng_restart(){
		fusheng_stop
		sleep 2s
		PID=`pidof fusheng`
		fusheng_start
}

if [ $# -gt 0 ];then

	if test -n "$1";then 
    	TYPE=$1
	else 
    	TYPE="FAILED"
	fi

	case $TYPE in
    	start) fusheng_start;;
    	restart) fusheng_restart;;
    	reload) fusheng_reload;;
    	stop) fusheng_stop;;
    	*) echo 'Please set TYPE in (start,restart,reload,stop)';;
	esac
else
	fusheng_start
fi

