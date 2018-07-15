
PROJECT=fusheng
CPPSRC=$(shell find . -type f | egrep *.cpp$$)
CPPOBJ=$(patsubst %.cpp,%.o,$(CPPSRC))
CCSRC=$(shell find . -type f | egrep *.cc$$)
CCOBJ=$(patsubst %.cc,%.o,$(CCSRC))
CXXSRC=$(shell find . -type f | egrep *.cxx$$)
CXXOBJ=$(patsubst %.cxx,%.o,$(CXXSRC))

CSRC=$(shell find . -type f | egrep *.c$$)
COBJ=$(patsubst %.c,%.o,$(CSRC))

OBJ=$(COBJ) $(CXXOBJ) $(CCOBJ) $(CPPOBJ)

CC=gcc
CXX=g++

CFLAGS+=-O3 -std=c11 -Wall
CXXFLAGS+=-O3 -std=c++11 -Wall
CXXFLAGS+=`pkg-config --cflags mongols`
LDLIBS+=`pkg-config --libs mongols`

ifndef INSTALL_DIR
INSTALL_DIR=/usr/local/fusheng
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
	cp fusheng.service /etc/systemd/system
	cp config.json $(INSTALL_DIR)
