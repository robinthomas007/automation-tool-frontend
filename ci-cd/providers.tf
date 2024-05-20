# Defining required terraform version and providers

terraform {
    required_version = ">= 1.0"
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "> 4.0"
        }
    }
  # backend config
    backend "s3" {}
}

provider "aws" {
    profile = "${var.profile}"
    region = "${var.region}"
    default_tags {
      tags = {
        Env = terraform.workspace
        CreatedBy = "Terraform"
        Project = "${var.ProjectName}"
      }
    }
}
