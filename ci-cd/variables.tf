
variable "profile" {}
variable "region" {}
variable "ProjectName" {}
variable "acm_certificate_arn" {}
variable "aliases_name" {
    type = list(string)
    default = []
}
