FROM rust:latest

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
#RUN cargo build --release

COPY src ./src/

CMD ["cargo", "run"]