package tn.sesame.springpfe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.mysql.cj.x.protobuf.MysqlxDatatypes.Scalar.String;

import springfox.documentation.swagger2.annotations.EnableSwagger2;
@EnableSwagger2
@SpringBootApplication

public class SpringpfeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringpfeApplication.class, args);
    }

}
