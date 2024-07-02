#!/bin/bash
docker volume rm embedgenerator_app -f
docker image rm embedgenerator-embed_generator -f
docker network rm embedgenerator_net -f