# create topics
docker exec -it kafka kafka-topics.sh --create --topic query-response --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 && \
docker exec -it kafka kafka-topics.sh --create --topic notice --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 && \
docker exec -it kafka kafka-topics.sh --create --topic reminder --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 && \
docker exec -it kafka kafka-topics.sh --create --topic result --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1
