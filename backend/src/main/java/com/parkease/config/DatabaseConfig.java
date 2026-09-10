package com.parkease.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("!test")
public class DatabaseConfig {

    @Value("${spring.datasource.url:${DB_URL:${DATABASE_URL:jdbc:postgresql://localhost:5432/parkease}}}")
    private String rawUrl;

    @Value("${spring.datasource.username:${DB_USERNAME:postgres}}")
    private String defaultUsername;

    @Value("${spring.datasource.password:${DB_PASSWORD:postgres}}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        
        String jdbcUrl = rawUrl;
        String username = defaultUsername;
        String password = defaultPassword;

        try {
            if (rawUrl != null && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
                URI uri = new URI(rawUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();

                jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                
                String query = uri.getQuery();
                if (query != null && !query.isBlank()) {
                    jdbcUrl += "?" + query;
                } else if (!"localhost".equalsIgnoreCase(host) && !"127.0.0.1".equals(host)) {
                    jdbcUrl += "?sslmode=require";
                }

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    username = userInfo[0];
                    if (userInfo.length > 1) {
                        password = userInfo[1];
                    }
                }
            } else if (rawUrl != null && !rawUrl.startsWith("jdbc:")) {
                jdbcUrl = "jdbc:" + rawUrl;
            }
        } catch (Exception e) {
            // Fallback to rawUrl as-is
            jdbcUrl = rawUrl;
        }

        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(30000);

        return new HikariDataSource(config);
    }
}
