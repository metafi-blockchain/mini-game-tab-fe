

docker buildx build --platform linux/amd64 -t metafi/ok-mini-app-fe:0.2.9  --load .

docker buildx build --platform linux/amd64,linux/arm64 -t metafi/ok-mini-app-fe:0.2.9 --push .

docker push metafi/ok-mini-app-fe:0.2.9