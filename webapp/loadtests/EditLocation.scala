
import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class EditLocation extends Simulation {

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
		"If-None-Match" -> """W/"11b8-42Rt9hXdC9L7mzJxNnu/fVZNUPc"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_3 = Map("Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_6 = Map(
		"If-None-Match" -> """W/"127f-PEZLNW0DItQj2AnCqmZmOR7sf+E"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")



	val scn = scenario("EditLocation")
		.exec(http("request_0")
			.options("/api/locations/add")
			.headers(headers_0)
			.resources(http("request_1")
			.post("/api/locations/add")
			.headers(headers_1)
			.body(RawFileBody("./editlocation/0001_request.json")),
            http("request_2")
			.get("/api/locations/list")
			.headers(headers_2),
            http("request_3")
			.get("/api/session/fetch?resource=https://uo269911gatling.inrupt.net/profile/card")
			.headers(headers_3)))
		.pause(10)
		.exec(http("request_4")
			.options("/api/locations/modify/608ec9e5ec4ccc00033b9f8f")
			.headers(headers_0)
			.resources(http("request_5")
			.post("/api/locations/modify/608ec9e5ec4ccc00033b9f8f")
			.headers(headers_1)
			.body(RawFileBody("./editlocation/0005_request.json")),
            http("request_6")
			.get("/api/locations/list")
			.headers(headers_6)))

	setUp(scn.inject(rampUsersPerSec(2) to (5) during (15 seconds) randomized)).protocols(httpProtocol)
}