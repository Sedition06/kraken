package aakriro

class UrlMappings {

    static mappings = {

       // get "/kraken/" {controller = "api"}
        //"/kraken/$controller/$action" {controller = "api"}


        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
