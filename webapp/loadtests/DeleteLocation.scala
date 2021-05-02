
import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class DeleteLocation extends Simulation {

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
		"If-None-Match" -> """W/"12c2-MjFnNb02jXXF8MkvZtibvNKxf18"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_3 = Map(
		"If-None-Match" -> """W/"389-P5qJaJHprmpRdOd/D3RStgfNXSE"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_4 = Map("Origin" -> "https://radarinen2awebapp.herokuapp.com")

	val headers_5 = Map(
		"If-None-Match" -> """W/"1389-WlXWoP8uGo/gusGOq2FnnTob8QY"""",
		"Origin" -> "https://radarinen2awebapp.herokuapp.com")



	val scn = scenario("DeleteLocation")
		.exec(http("request_0")
			.options("/api/locations/add")
			.headers(headers_0)
			.resources(http("request_1")
			.post("/api/locations/add")
			.headers(headers_1)
			.body(RawFileBody("./deletelocation/0001_request.json")),
            http("request_2")
			.get("/api/locations/list")
			.headers(headers_2),
            http("request_3")
			.get("/api/session/fetch?resource=https://uo269911gatling.inrupt.net/profile/card")
			.headers(headers_3)))
		.pause(7)
		.exec(http("request_4")
			.get("/api/locations/delete/608eca07ec4ccc00033b9f90")
			.headers(headers_4)
			.resources(http("request_5")
			.get("/api/locations/list")
			.headers(headers_5)))

	setUp(scn.inject(rampUsersPerSec(2) to (5) during (15 seconds) randomized)).protocols(httpProtocol)
}