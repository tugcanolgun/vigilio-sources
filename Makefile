.ONESHELL:
ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
VENV:=${ROOT_DIR}/venv/bin

default:
	@echo "Available commands"
	@echo "'start'"
	@echo "'build'"

check_venv:
	@if [ -a ${ROOT_DIR}/venv/bin/activate ]; \
	then \
		echo "Found virtualenv"; \
	fi;

fix: check_venv
	@echo "Running syntax fixer"
	@${VENV}/black --exclude venv ${ROOT_DIR}
	@echo "Syntax fixer process ended"

lint: check_venv
	@echo "Running linter"
	@${VENV}/flake8 ${ROOT_DIR} --exclude=venv/ --max-line-length 99
	@echo "Linter process ended"

start:
	@echo "Initiating node server..."
	yarn --cwd ${ROOT_DIR}/frontend start

build:
	@echo "Compiling js files..."
	yarn --cwd ${ROOT_DIR}/frontend build
	@echo "Compilation has finished."
