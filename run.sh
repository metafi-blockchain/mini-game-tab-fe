

docker buildx build --platform linux/amd64 -t metafi/ok-mini-app-fe:0.2.4  --load .

docker buildx build --platform linux/amd64,linux/arm64 -t metafi/ok-mini-app-fe:0.2.4 --push .

docker push metafi/ok-mini-app-fe:0.2.4