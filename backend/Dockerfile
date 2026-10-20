FROM maven:3.8.6-openjdk-8
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests
RUN mkdir -p /tmp/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "target/architect-portfolio-1.0.0.jar"]
