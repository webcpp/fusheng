
PROJECT=fusheng
CPPSRC=$(shell find src -type f | egrep *.cpp$$)
CPPOBJ=$(patsubst %.cpp,%.o,$(CPPSRC))
CCSRC=$(shell find src -type f | egrep *.cc$$)
CCOBJ=$(patsubst %.cc,%.o,$(CCSRC))
CXXSRC=$(shell find src -type f | egrep *.cxx$$)
CXXOBJ=$(patsubst %.cxx,%.o,$(CXXSRC))

CSRC=$(shell find src -type f | egrep *.c$$)
COBJ=$(patsubst %.c,%.o,$(CSRC))

OBJ=$(COBJ) $(CXXOBJ) $(CCOBJ) $(CPPOBJ)

CC=gcc
CXX=g++

CFLAGS+=-O3 -std=c11 -Wall
CXXFLAGS+=-O3 -std=c++11 -Wall
CXXFLAGS+=`pkg-config --cflags mongols openssl`
LDLIBS+=`pkg-config --libs mongols openssl`

ifndef INSTALL_DIR
INSTALL_DIR=/usr/local/$(PROJECT)
endif


all:$(PROJECT)

$(PROJECT):$(OBJ)
	$(CXX) $(LDFLAGS) -o $@ $^ $(LDLIBS) 

.c.o:
	$(CC) $(CFLAGS) -c $< -o $@

.cpp.o:
	$(CXX) $(CXXFLAGS)  -c $< -o $@

.cc.o:
	$(CXX) $(CXXFLAGS)  -c $< -o $@
	
.cxx.o:
	$(CXX) $(CXXFLAGS)  -c $< -o $@

clean:
	@for i in $(OBJ);do echo "rm -f" $${i} && rm -f $${i} ;done
	rm -f $(PROJECT)


install:
	test -d $(INSTALL_DIR)/ || mkdir -p $(INSTALL_DIR)/
	install $(PROJECT) $(INSTALL_DIR)
	install fusheng-ctl.sh $(INSTALL_DIR)
	rm -f /etc/init.d/fusheng.sh 
	ln -s $(INSTALL_DIR)/fusheng-ctl.sh /etc/init.d/fusheng.sh
	cp config.json $(INSTALL_DIR)
	install upload.py $(INSTALL_DIR)

