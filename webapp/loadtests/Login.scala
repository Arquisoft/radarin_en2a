
import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class Login extends Simulation {

	val httpProtocol = http
		.baseUrl("https://radarinen2arestapi.herokuapp.com")
		.inferHtmlResources(BlackList(""".*\.js""", """.*\.css""", """.*\.gif""", """.*\.jpeg""", """.*\.jpg""", """.*\.ico""", """.*\.woff""", """.*\.woff2""", """.*\.(t|o)tf""", """.*\.png""", """.*detectportal\.firefox\.com.*"""), WhiteList())
		.acceptHeader("*/*")
		.acceptEncodingHeader("gzip, deflate")
		.acceptLanguageHeader("en-US,en;q=0.5")
		.userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0")

	val headers_0 = Map(
		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
		"Cache-Control" -> "max-age=0",
		"DNT" -> "1",
		"If-Modified-Since" -> "Sun, 02 May 2021 12:04:11 GMT",
		"If-None-Match" -> """W/"c10-1792cf6ee78"""",
		"Upgrade-Insecure-Requests" -> "1")

	val headers_1 = Map(
		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
		"DNT" -> "1",
		"Upgrade-Insecure-Requests" -> "1")

	val headers_2 = Map(
		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
		"DNT" -> "1",
		"Origin" -> "https://inrupt.net",
		"Upgrade-Insecure-Requests" -> "1")

	val headers_3 = Map(
		"DNT" -> "1",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_7 = Map(
		"Accept-Encoding" -> "gzip, deflate",
		"Content-Type" -> "application/ocsp-request")

    val uri1 = "https://inrupt.net/login/password"
    val uri4 = "https://radarinen2awebapp.herokuapp.com"

	val scn = scenario("Login")
		.exec(http("request_0")
			.get(uri4 + "/")
			.headers(headers_0))
		.pause(2)
		.exec(http("request_1")
			.get("/api/session/login?redirectUrl=https://radarinen2awebapp.herokuapp.com/&oidcIssuer=https://inrupt.net")
			.headers(headers_1))
		.pause(13)
		.exec(http("request_2")
			.post(uri1)
			.headers(headers_2)
			.formParam("username", "uo269911gatling")
			.formParam("password", "Radar$Gatling22")
			.formParam("response_type", "code")
			.formParam("display", "")
			.formParam("scope", "openid offline_access")
			.formParam("client_id", "7f1ef9019e3bf0954c4174cbeaa2ee79")
			.formParam("redirect_uri", "https://radarinen2arestapi.herokuapp.com/api/session/login/redirect?sessionId=b5cbf543-9cc0-4583-b858-feffd8cda693")
			.formParam("state", "qdQtHE-kZobM3VFuZaQt_rwfeLOoNsXWm0nJu-zatIw")
			.formParam("nonce", "")
			.formParam("request", "")
			.resources(http("request_3")
			.get("/api/session/info?sessionId=b5cbf543-9cc0-4583-b858-feffd8cda693")
			.headers(headers_3),
            http("request_4")
			.get("/api/locations/list")
			.headers(headers_3),
            http("request_5")
			.get("/api/users/list")
			.headers(headers_3),
            http("request_6")
			.get("/api/users/friends?sessionId=b5cbf543-9cc0-4583-b858-feffd8cda693")
			.headers(headers_3)))

	setUp(scn.inject(rampUsersPerSec(2) to (5) during (15 seconds) randomized)).protocols(httpProtocol)
}