
import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class AddLocation extends Simulation {

	val httpProtocol = http
		.baseUrl("https://radarinen2arestapi.herokuapp.com")
		.inferHtmlResources(BlackList(""".*\.js""", """.*\.css""", """.*\.gif""", """.*\.jpeg""", """.*\.jpg""", """.*\.ico""", """.*\.woff""", """.*\.woff2""", """.*\.(t|o)tf""", """.*\.png""", """.*detectportal\.firefox\.com.*"""), WhiteList())
		.acceptHeader("*/*")
		.acceptEncodingHeader("gzip, deflate")
		.acceptLanguageHeader("en-US,en;q=0.5")
		.doNotTrackHeader("1")
		.userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0")

	val headers_0 = Map(
		"Access-Control-Request-Headers" -> "content-type",
		"Access-Control-Request-Method" -> "POST",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_1 = Map(
		"Content-Type" -> "application/json",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_2 = Map(
		"If-None-Match" -> """W/"f63-7jMFS+3lwHzH62BmVHebIlDAGAk"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_4 = Map(
		"If-None-Match" -> """W/"102a-1pG2XIPnAjT44d1C1e6XBEtqt2g"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_7 = Map(
		"If-None-Match" -> """W/"10f1-HZ8Ee/mtwx+JZXURx16A12bx4fc"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")



	val scn = scenario("AddLocation")
		.exec(http("request_0")
			.options("/api/locations/add")
			.headers(headers_0)
			.resources(http("request_1")
			.post("/api/locations/add")
			.headers(headers_1)
			.body(RawFileBody("./addlocation/0001_request.json")),
            http("request_2")
			.get("/api/locations/list")
			.headers(headers_2)))
		.pause(2)
		.exec(http("request_3")
			.post("/api/locations/add")
			.headers(headers_1)
			.body(RawFileBody("./addlocation/0003_request.json"))
			.resources(http("request_4")
			.get("/api/locations/list")
			.headers(headers_4)))
		.pause(2)
		.exec(http("request_5")
			.options("/api/locations/add")
			.headers(headers_0)
			.resources(http("request_6")
			.post("/api/locations/add")
			.headers(headers_1)
			.body(RawFileBody("./addlocation/0006_request.json")),
            http("request_7")
			.get("/api/locations/list")
			.headers(headers_7)))

	setUp(scn.inject(rampUsersPerSec(2) to (5) during (15 seconds) randomized)).protocols(httpProtocol)
}