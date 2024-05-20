# iam policy
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    sid = "1"

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "arn:aws:s3:::${terraform.workspace}-sedstart-website/*",
    ]

    principals {
      type = "AWS"

      identifiers = [
        aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn,
      ]
    }
  }
}

# cloudfront OAI
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "access-identity-${terraform.workspace}-sedstart-website.s3.amazonaws.com"
}

# s3 bucket
resource "aws_s3_bucket" "s3_bucket" {
   bucket = "${terraform.workspace}-sedstart-website"
}

# s3 policy
resource "aws_s3_bucket_policy" "s3_bucket_policy" {
  bucket = aws_s3_bucket.s3_bucket.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json

}

# s3 bucket versioning
resource "aws_s3_bucket_versioning" "s3_bucket" {
  bucket = "${terraform.workspace}-sedstart-website"
  versioning_configuration {
    status = "Enabled"
  }
}

# distribute with cloudfront
resource "aws_s3_bucket_website_configuration" "s3_bucket" {
  bucket = aws_s3_bucket.s3_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# cloudfront distribution
resource "aws_cloudfront_distribution" "sedstart_static_content_distribution" {
  origin {
    domain_name = aws_s3_bucket.s3_bucket.bucket_regional_domain_name
    origin_id   = "S3Origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"

  aliases = var.aliases_name

  default_cache_behavior {
    target_origin_id        = "S3Origin"
    viewer_protocol_policy  = "redirect-to-https"
    allowed_methods         = ["GET", "HEAD", "OPTIONS"]
    cached_methods          = ["GET", "HEAD", "OPTIONS"]

    forwarded_values {
      query_string    = false
      cookies {
        forward     = "none"
      }
    }

    compress    = true
    min_ttl     = 0
    max_ttl     = 86400
    default_ttl = 3600
  }

  price_class = "PriceClass_All"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_root_object = "index.html"

  custom_error_response {
    error_code          = 403
    response_page_path  = "/index.html"
    response_code       = 200
  }

  custom_error_response {
    error_code          = 404
    response_page_path  = "/index.html"
    response_code       = 200
  }

  viewer_certificate {
    cloudfront_default_certificate  = true
    minimum_protocol_version        = "TLSv1.2_2021"
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method = "sni-only"
  }
}